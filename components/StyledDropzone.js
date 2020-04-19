import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@rebass/grid';
import { isNil } from 'lodash';
import { useDropzone } from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import styled, { css } from 'styled-components';
import { v4 as uuid } from 'uuid';

import { uploadImageWithXHR } from '../lib/api';

import Container from './Container';
import { getI18nLink } from './I18nFormatters';
import StyledSpinner from './StyledSpinner';
import { P } from './Text';

import { Download as DownloadIcon } from '@styled-icons/feather/Download';

const Dropzone = styled(Container)`
  border: 1px dashed #c4c7cc;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &:hover:not(:disabled) {
    background: #f9f9f9;
    border-color: ${props => props.theme.colors.primary[300]};
  }

  &:focus {
    outline: 0;
    border-color: ${props => props.theme.colors.primary[500]};
  }

  ${props =>
    props.error &&
    css`
      border-color: ${props.theme.colors.red[500]};
    `}

  img {
    max-height: 100%;
    max-width: 100%;
  }
`;

/** Fets the average progress from a list of upload progress */
const getUploadProgress = uploadProgressList => {
  if (!uploadProgressList || uploadProgressList.length === 0) {
    return 0;
  } else {
    const totalUploadProgress = uploadProgressList.reduce((total, current) => total + current, 0);
    return Math.trunc(totalUploadProgress / uploadProgressList.length);
  }
};

/**
 * A dropzone to upload one or multiple files
 */
const StyledDropzone = ({
  onSuccess,
  onReject,
  showDefaultMessage,
  children,
  isLoading,
  loadingProgress,
  minHeight,
  size,
  fontSize,
  mockImageGenerator,
  accept,
  minSize,
  maxSize,
  error,
  isMulti,
  ...props
}) => {
  const [isUploading, setUploading] = React.useState(false);
  const [uploadProgressList, setUploadProgressList] = React.useState([]);
  const uploadProgress = getUploadProgress(uploadProgressList);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    minSize,
    maxSize,
    multiple: isMulti,
    onDrop: React.useCallback(
      async (acceptedFiles, rejectedFiles) => {
        setUploading(true);
        const filesToUpload = isMulti ? acceptedFiles : [acceptedFiles[0]];
        const files = await Promise.all(
          filesToUpload.map((file, index) =>
            uploadImageWithXHR(file, {
              mockImage: mockImageGenerator && mockImageGenerator(index),
              onProgress: progress => {
                const newProgressList = [...uploadProgressList];
                newProgressList.splice(index, 0, progress);
                setUploadProgressList(newProgressList);
              },
            }),
          ),
        );

        setUploading(false);

        if (onSuccess) {
          await onSuccess(isMulti ? files : files[0]);
        }

        if (onReject) {
          onReject(isMulti ? rejectedFiles : rejectedFiles[0]);
        }
      },
      [isMulti, onSuccess, onReject, mockImageGenerator, uploadProgressList],
    ),
  });

  minHeight = size || minHeight;
  const innerMinHeight = minHeight - 2; // -2 To account for the borders
  return (
    <Dropzone {...props} {...getRootProps()} minHeight={size || minHeight} size={size} error={error}>
      <input {...getInputProps()} />
      {isLoading || isUploading ? (
        <Container
          position="relative"
          display="flex"
          justifyContent="center"
          alignItems="center"
          size="100%"
          minHeight={innerMinHeight}
        >
          <Container
            position="absolute"
            display="flex"
            justifyContent="center"
            alignItems="center"
            size={innerMinHeight}
          >
            <StyledSpinner size="70%" />
          </Container>
          {isUploading && <Container fontSize="Caption">{uploadProgress}%</Container>}
          {isLoading && !isNil(loadingProgress) && <Container>{loadingProgress}%</Container>}
        </Container>
      ) : (
        <Container my={3} maxHeight="100%" maxWidth="100%" position="relative">
          {isDragActive ? (
            <Container color="primary.500">
              <Box mb={2}>
                <DownloadIcon size={20} />
              </Box>
              <FormattedMessage
                id="StyledDropzone.DropMsg"
                defaultMessage="Drop {count,plural, one {file} other {files}} here"
                values={{ count: isMulti ? 2 : 1 }}
              />
            </Container>
          ) : (
            <React.Fragment>
              {showDefaultMessage && (
                <P color="black.500" px={2} fontSize={fontSize}>
                  {isMulti ? (
                    <FormattedMessage
                      id="DropZone.UploadBox"
                      defaultMessage="Drag and drop one or multiple files or <i18n-link>click here to select</i18n-link>."
                      values={{ 'i18n-link': getI18nLink() }}
                    />
                  ) : (
                    <FormattedMessage
                      id="DragAndDropOrClickToUpload"
                      defaultMessage="Drag & drop or <i18n-link>click to upload</i18n-link>"
                      values={{ 'i18n-link': getI18nLink() }}
                      tagName="span"
                    />
                  )}
                </P>
              )}
              {children}
            </React.Fragment>
          )}
        </Container>
      )}
    </Dropzone>
  );
};

StyledDropzone.propTypes = {
  /** Called back with the uploaded files on success */
  onSuccess: PropTypes.func,
  /** Called back with the rejectd files */
  onReject: PropTypes.func,
  /** Content to show inside the dropzone. Defaults to message "Drag and drop one or..." */
  children: PropTypes.node,
  /** Whether to show the default message. By default, the message will be displayed if there's no children */
  showDefaultMessage: PropTypes.bool,
  /** Force loading state to be displayed */
  isLoading: PropTypes.bool,
  /** Use this to override the loading progress indicator */
  loadingProgress: PropTypes.number,
  /** Font size used for the default messages */
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Min height of the container */
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** To have square container */
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
  /** A function to generate mock images */
  mockImageGenerator: PropTypes.func,
  /** Wether the dropzone should accept multiple files */
  isMulti: PropTypes.bool,
  /** Filetypes to accept */
  accept: PropTypes.string,
  /** Min file size */
  minSize: PropTypes.number,
  /** Max file size */
  maxSize: PropTypes.number,
  /** A truthy/falsy value defining if the field has an error (ie. if it's required) */
  error: PropTypes.any,
  /** required field */
  required: PropTypes.bool,
};

StyledDropzone.defaultProps = {
  minHeight: 96,
  mockImageGenerator: () => `https://loremflickr.com/120/120?lock=${uuid()}`,
  isMulti: true,
  fontSize: 'Paragraph',
  showDefaultMessage: true,
};

export default StyledDropzone;
