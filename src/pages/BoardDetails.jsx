import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

import "../styles/_boardDetails.scss";
export function BoardDetails() {
  return (
    <div className="main-container">
      This is board Details
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        This is a test for Material UI component
      </Alert>
    </div>
  );
}
