import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ThemeColors } from "../../../CustomStyles";

export default function BasicTable() {
  return (
    <>
      <Typography style={{ color: ThemeColors.info, textAlign: "center" }}>
        This is an example of an XLSX file. The columns names{" "}
        <b>MUST BE EXACT</b> in order to be stored as a lead entity. If not, all
        the additional columns will be stored as additional content.
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                textOverflow: "normal",
                fontWeight: "bold",
                color: ThemeColors.buttonsecondary,
              }}
              align="left"
            >
              source
            </TableCell>
            <TableCell
              style={{
                textOverflow: "normal",
                fontWeight: "bold",
                color: ThemeColors.buttonsecondary,
              }}
              align="left"
            >
              submittedDate
            </TableCell>
            <TableCell
              style={{
                textOverflow: "normal",
                fontWeight: "bold",
                color: ThemeColors.buttonsecondary,
              }}
              align="left"
            >
              email
            </TableCell>
            <TableCell
              style={{
                textOverflow: "normal",
                fontWeight: "bold",
                color: ThemeColors.buttonsecondary,
              }}
              align="left"
            >
              phone
            </TableCell>
            <TableCell
              style={{
                textOverflow: "normal",
                fontWeight: "bold",
                color: ThemeColors.buttonsecondary,
              }}
              align="left"
            >
              course
            </TableCell>
            <TableCell
              style={{
                textOverflow: "normal",
                fontWeight: "bold",
                color: ThemeColors.buttonsecondary,
              }}
              align="left"
            >
              dateOfBirth
            </TableCell>
            <TableCell
              style={{
                textOverflow: "normal",
                fontWeight: "bold",
                color: ThemeColors.buttonsecondary,
              }}
              align="left"
            >
              asigneeId
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{ textOverflow: "normal" }} align="left">
              Facebook campaign - CampaignName
            </TableCell>
            <TableCell style={{ textOverflow: "normal" }} align="left">
              18.07.2023, 08:20
            </TableCell>
            <TableCell style={{ textOverflow: "normal" }} align="left">
              Nume1 Prenume2
            </TableCell>
            <TableCell style={{ textOverflow: "normal" }} align="left">
              numeprenume1@gmail.com
            </TableCell>
            <TableCell style={{ textOverflow: "normal" }} align="left">
              Construction
            </TableCell>
            <TableCell align="left">18.07.1999, 08:20</TableCell>
            <TableCell align="left">existingUserEmail@yahoo.com</TableCell>
          </TableRow>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell style={{ textOverflow: "normal" }} align="left">
              Tiktok campaign - CampaignName
            </TableCell>
            <TableCell style={{ textOverflow: "normal" }} align="left">
              18.07.2023, 08:20
            </TableCell>
            <TableCell style={{ textOverflow: "normal" }} align="left">
              Nume2 Prenume3
            </TableCell>
            <TableCell style={{ textOverflow: "normal" }} align="left">
              numeprenume2@gmail.com
            </TableCell>
            <TableCell style={{ textOverflow: "normal" }} align="left">
              Healthcare
            </TableCell>
            <TableCell style={{ textOverflow: "normal" }} align="left">
              18.07.1999, 08:20
            </TableCell>
            <TableCell style={{ textOverflow: "normal" }} align="left">
              existingUserEmail@yahoo.com
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
