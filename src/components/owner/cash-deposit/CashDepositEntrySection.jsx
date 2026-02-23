import CashActionButtons from "./CashActionButtons";
import CustomerSelect from "./CustomerSelect";
import DepositDetails from "./DepositDetails";

export default function CashDepositEntrySection({
  currentBalance,
  searchTerm,
  onSearchChange,
  customers,
  selectedCustomer,
  onSelectCustomer,
  isSearching,
  depositAmount,
  setDepositAmount,
  quickAmounts,
  newBalance,
  onConfirm,
  onCancel,
}) {
  return (
    <>
      <CustomerSelect
        currentBalance={currentBalance}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        customers={customers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={onSelectCustomer}
        isSearching={isSearching}
      />

      <DepositDetails
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        quickAmounts={quickAmounts}
        newBalance={newBalance}
        currentBalance={currentBalance}
      />

      <CashActionButtons onConfirm={onConfirm} onCancel={onCancel} />
    </>
  );
}
