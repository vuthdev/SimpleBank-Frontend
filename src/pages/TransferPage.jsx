import { Transfer } from "../components/transfer/Transfer";

// Transfer reads token, user, reloadUser directly from AuthContext
// and showToast from ToastContext — no props needed here
export function TransferPage() {
  return <Transfer />;
}
