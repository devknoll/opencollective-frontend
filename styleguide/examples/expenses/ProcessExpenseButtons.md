## All buttons

```jsx
<ProcessExpenseButtons
  expense={{ legacyId: 42 }}
  permissions={{
    canApprove: true,
    canUnapprove: true,
    canReject: true,
    canPay: true,
    canMarkAsUnpaid: true,
  }}
/>
```

## Displayed buttons is based on the permissions

```jsx
<ProcessExpenseButtons
  expense={{ legacyId: 42 }}
  permissions={{
    canApprove: true,
    canReject: true,
  }}
/>
```
