"use client";

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { CheckCircle2, Clock } from 'lucide-react';

const ComparisonTable = ({ data }) => {
  const { title, columns, rows } = data;

  return (
    <Paper
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid #e0e0e0'
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
          {title}
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    color: '#666',
                    backgroundColor: '#fafafa',
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  '&:hover': { backgroundColor: '#fafafa' },
                  backgroundColor: row.recommended ? '#f8f9ff' : 'inherit',
                  borderLeft: row.recommended ? '3px solid #2196f3' : 'none'
                }}
              >
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.supplier}
                    </Typography>
                    {row.recommended && (
                      <CheckCircle2 size={16} color="#2196f3" />
                    )}
                  </Box>
                </TableCell>
                
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                  {row.price === 'Pending' ? (
                    <Chip
                      icon={<Clock size={14} />}
                      label="Pending"
                      size="small"
                      variant="outlined"
                      sx={{ color: '#666', borderColor: '#ddd' }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.price}
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                  {row.delivery === 'Unknown' ? (
                    <Chip
                      label="Unknown"
                      size="small"
                      variant="outlined"
                      sx={{ color: '#666', borderColor: '#ddd' }}
                    />
                  ) : (
                    <Typography variant="body2">
                      {row.delivery}
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                  <Typography variant="body2">
                    {row.shipping}
                  </Typography>
                </TableCell>
                
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                  {row.total === 'Pending' ? (
                    <Chip
                      label="Pending"
                      size="small"
                      variant="outlined"
                      sx={{ color: '#666', borderColor: '#ddd' }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.total}
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell sx={{ borderBottom: '1px solid #f0f0f0' }}>
                  {row.score === 'N/A' ? (
                    <Chip
                      label="N/A"
                      size="small"
                      variant="outlined"
                      sx={{ color: '#666', borderColor: '#ddd' }}
                    />
                  ) : (
                    <Chip
                      label={row.score}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        color: row.recommended ? '#2196f3' : '#666',
                        borderColor: row.recommended ? '#2196f3' : '#ddd',
                        fontWeight: 500
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ComparisonTable;