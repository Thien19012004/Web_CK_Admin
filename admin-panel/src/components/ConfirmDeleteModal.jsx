import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const ConfirmDeleteModal = ({
  showDeleteModal,
  handleCloseDeleteModal,
  handleDeleteConfirmed,
  productToDelete,
}) => {
  return (
    <Dialog
      open={showDeleteModal}
      onClose={handleCloseDeleteModal}
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
    >
      <DialogTitle id="confirm-delete-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-delete-description">
          Are you sure you want to delete the product{" "}
          <strong>{productToDelete?.name}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteConfirmed}
        >
          Confirm
        </Button>
        <Button variant="outlined" color="default" onClick={handleCloseDeleteModal}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
