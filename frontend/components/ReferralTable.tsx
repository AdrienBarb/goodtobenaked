import React, { FC } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import { useTranslations } from "next-intl";
import NoResults from "./Common/NoResults";

interface ReferralTableProps {
  referrals: {
    pseudo: string;
    totalCommissions: number;
    totalCommissionAmount: number;
  }[];
}

const ReferralTable: FC<ReferralTableProps> = ({ referrals = [] }) => {
  //traduction
  const t = useTranslations();

  return (
    <TableContainer
      component={Paper}
      sx={{ boxShadow: "none", backgroundColor: "#FFF0EB" }}
    >
      {referrals?.length > 0 ? (
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>
                {t("referral.pseudo")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referrals.map((currentReferral, index) => {
              return (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    <p>{currentReferral?.pseudo}</p>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <NoResults text={t("referral.no_referrals")} />
      )}
    </TableContainer>
  );
};

export default ReferralTable;
