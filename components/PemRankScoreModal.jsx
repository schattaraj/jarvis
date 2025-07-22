import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Context } from "../contexts/Context";
import { fetchWithInterceptor } from "../utils/utils";

function PemRankScoreModal({ score, open, handleCloseModal }) {
  const [data, setData] = useState([]);

  console.log('Modal rendered with score:', score);
  
  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box sx={{
        marginLeft: "auto",
        marginRight: "auto",
        width: "80%",
        overflowY: "auto",
        height: "auto",
        maxHeight: "100vh",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 3,
      }}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 2,
        }}>
          <Typography variant="h6">PEM Rank Score Details</Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Parameter Name</TableCell>
                <TableCell>Parameter Value</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.parameterName}</TableCell>
                  <TableCell>{row.parameterValue}</TableCell>
                  <TableCell>{row.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
}

export default PemRankScoreModal;