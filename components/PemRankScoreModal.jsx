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

const pemParameterMapping = {
  "Organic Sales Growth Rate of Company (TTM)": "element6",
  "Organic Growth rate of TAM": "element7",
  "Revenue Generation Consistency": "element11",
  "Normalized ROIC": "element12",
  "Tailwinds": "element17",
  "Pricing Power": "element18",
  "Value Proposition Savings/Efficiency": "element22",
};


function evaluateRule(simpleRule, paramValue, paramName) {
  if (!simpleRule) return false;

  let expr = simpleRule
    .replaceAll(`{${paramName}}`, "val")
    .replace(/'/g, "")
    .replace(/\band\b/g, "&&")
    .replace(/\bor\b/g, "||")
    .replace(/\b=\b/g, "===");

  try {

    const fn = new Function("val", `return ${expr};`);
    return fn(paramValue);
  } catch (e) {
    return false;
  }
}

function PemRankScoreModal({ score, open, handleCloseModal, pemRowData, ruleData }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (pemRowData && ruleData) {
      const modalData = Object.entries(pemParameterMapping).map(([paramName, elementKey]) => {
        let rawValue = pemRowData[elementKey] || 0;
        let paramValue = rawValue;

        if (elementKey === 'element6' || elementKey === 'element7') {
          paramValue = parseFloat(rawValue) * 100;
        } else {
          paramValue = parseFloat(rawValue);
        }


        const rulesForParam = ruleData.filter(
          rule => rule.simpleRule && rule.simpleRule.includes(`{${paramName}}`)
        );


        let matchedRank = 0;
        for (const rule of rulesForParam) {
          if (evaluateRule(rule.simpleRule, paramValue, paramName)) {
            matchedRank = rule.rank;
            break;
          }
        }


        let displayValue = paramValue;
        if (elementKey === 'element6' || elementKey === 'element7') {
          displayValue = paramValue.toFixed(2);
        } else if (!isNaN(paramValue)) {
          displayValue = paramValue.toFixed(2);
        }

        return {
          parameterName: paramName,
          parameterValue: displayValue,
          score: matchedRank,
        };
      });

      const totalRow = {
        parameterName: <strong>Total Score</strong>,
        parameterValue: '',
        score: <strong>{score}</strong>,
      };

      setData([...modalData,totalRow]);
    }
  }, [pemRowData, score, ruleData]);


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