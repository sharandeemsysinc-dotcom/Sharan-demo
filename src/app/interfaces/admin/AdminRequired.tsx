import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Layout from "../../../shared/layout/sidebarLayout";
import { selectCurrentAccessToken, selectCurrentScope } from "../../stores/authSlice";

const AdminRequired = () => {
  const token = useSelector(selectCurrentAccessToken);
  const scope = useSelector(selectCurrentScope);

  return token && scope === 'Admin' ? <Layout /> : <Navigate to="/auth/login" replace />;
};

export default AdminRequired;