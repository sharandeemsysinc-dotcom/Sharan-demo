import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Layout from "../../../shared/layout/sidebarLayout";
import { selectCurrentAccessToken, selectCurrentScope } from "../../stores/authSlice";

const ClientRequired = () => {
  const token = useSelector(selectCurrentAccessToken);
  const scope = useSelector(selectCurrentScope);

  return token && scope === 'Client' ? <Layout /> : <Navigate to="/auth/login" replace />;
};

export default ClientRequired;