import {
  Alert,
  Button,
  Card,
  Chip,
  Grid,
  IconButton,
  InputLabel,
  SelectProps,
  TableCell,
  TableRow,
  TextField,
  TextFieldProps,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { ReactElement } from "react";
import styled from "styled-components";

export enum Status {
  NEW = "new",
  ATTEMPTED = "attemptedToContact",
  OPEN = "open",
  UNQUALIFIED = "unqualified",
  WAITING = "waiting",
}

export const StatusColors = {
  [Status.NEW]: "#FDFFAE",
  [Status.ATTEMPTED]: "#FFE17B",
  [Status.OPEN]: "#CBFFA9",
  [Status.UNQUALIFIED]: "#FFB4B4",
  [Status.WAITING]: "#DBDFEA",
};

export enum Theme {
  LIGHT = "light",
  WHITE = "white",
  WHITELOW = "whitelow",
  DARK = "dark",
  GRAY = "gray",
  PRIMARY = "primary",
  SECONDARY = "secondary",
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  WARNINGDARK = "warningdark",
  DANGER = "danger",
  HOVER = "hover",
  BUTTON = "button",
  HIGHLIGHT = "highlight",
  UNHIGHLIGHT = "unhighlight",
  BUTTONPRIMARY = "buttonprimary",
  BUTTONSECONDARY = "buttonsecondary",
  COURSESCHIP = "courseschip",
  NEGATIVECOURSESCHIP = "negativecourseschip",
  FILTERS = "filters",
}

export const ThemeColors = {
  [Theme.LIGHT]: "#FCFDE4",
  [Theme.WHITE]: "#f8f8f7",
  [Theme.WHITELOW]: "#f2f2ed",
  [Theme.DARK]: "#000000",
  [Theme.GRAY]: "#6f7174",
  [Theme.PRIMARY]: "#DCE474",
  [Theme.SECONDARY]: "#646D16",
  [Theme.SUCCESS]: "#72D843",
  [Theme.INFO]: "#426BFF",
  [Theme.WARNING]: "#e68a00",
  [Theme.WARNINGDARK]: "#804d00",
  [Theme.DANGER]: "#c74449",
  [Theme.HOVER]: "#202949",
  [Theme.BUTTON]: "#A1AA22",
  [Theme.HIGHLIGHT]: "#3d4a76",
  [Theme.UNHIGHLIGHT]: "#1a2032",
  [Theme.BUTTONSECONDARY]: "#3c6659",
  [Theme.BUTTONPRIMARY]: "#538D7B",
  [Theme.COURSESCHIP]: "#96B6C5",
  [Theme.NEGATIVECOURSESCHIP]: "#ADC4CE",
  [Theme.FILTERS]: "#434D70",
};

export const TableActionsGrid = styled(Grid)`
  margin-top: var(--egg-size-tiny);
  align-items: center;
  justify-content: space-between;
`;

export const TypographyNoTextTransform = styled(Typography)`
  text-transform: none;
  font-size: 14px;
`;

export const CreateButton = styled(Button)`
  height: 50px;
  &:hover {
    background-color: var(--egg-primary-hover);
  }
`;

export const CustomTableRowTitle = styled(TableRow)`
  background-color: ${ThemeColors.primary};
`;

export const CustomTableCellTitle = styled(TableCell)`
  color: ${ThemeColors.dark};
`;

export const CustomTableRow = styled(TableRow)`
  background-color: transparent;
  &:hover {
    background-color: ${ThemeColors.hover};
    cursor: pointer;
  }
`;

export const customTableStyles = {
  rows: {
    style: {},
  },
  headCells: {
    style: {
      color: ThemeColors.dark,
      backgroundColor: ThemeColors.primary,
    },
  },
  cells: {
    style: {
      width: "100px", // Set the desired minWidth for cells
    },
  },
  pagination: {
    style: {
      backgroundColor: ThemeColors.primary,
      color: ThemeColors.dark,
      borderRadius: "0px 0px 4px 4px",
    },
  },
};

export const CustomTableCell = styled(TableCell)`
  color: ${ThemeColors.white} !important;
`;

export const LeftContainedButton = styled(Button)`
  height: 50px;
  min-width: 120px;
  color: var(--egg-text-color-white);
  background-color: var(--egg-primary);
  &:hover {
    background-color: var(--egg-primary-hover);
  }
`;

export const AlertColor = styled(Alert)`
  color: white;
  background-color: purple;
`;

export const LeftOutlinedButton = styled(Button)`
  margin-left: var(--egg-size-tiny);
  margin-right: var(--egg-size-tiny);
  height: 50px;
  min-width: 120px;
  color: var(--egg-primary);
  background-color: var(--caviar-color-opacity-white-40);
  border: 1px solid var(--egg-primary);
  &:hover {
    background-color: var(--caviar-color-surface-light-level-2);
  }
`;

export const ButtonsGrid = styled(Grid)`
  margin-top: var(--egg-size-tiny);
  margin-bottom: var(--egg-size-small);
  justify-content: flex-start;
`;

export const MarginRightChip = styled(Chip)`
  margin-right: var(--egg-size-tiny);
  text-transform: capitalize;
`;

export const MarginLeftChip = styled(Chip)`
  margin-left: var(--egg-size-tiny);
  text-transform: capitalize;
`;

export const FilterLabel = styled(InputLabel)`
  margin: 0;
  font-size: 10px;
`;

export const tableCustomStyles = (headerBackground: string) => ({
  table: {
    style: {
      boxShadow: "var(--egg-elevation-level-4)",
      border: "2px",
      borderRadius: "4px",
      backgroundColor: "transparent",
      padding:
        "0px var(--egg-size-medium) var(--egg-size-tiny) var(--egg-size-medium)",
      margin: "auto",
    },
  },
  rows: {
    stripedStyle: {
      backgroundColor: "var(--caviar-color-surface-light-level-2)",
    },
  },
  headCells: {
    style: {
      backgroundColor: "transparent",
      color: "var(--egg-text-color-white)",
      fontSize: "14px",
      ".rdt_TableCol_Sortable:hover": {
        background: "none !important",
        color: "var(--egg-text-color-white) !important",
        alignContent: "flex-start",
      },
      ".MuiSvgIcon-root": {
        color: "var(--egg-white-100) !important",
        transform: "scale(1.2)",
        marginLeft: "4px",
        display: "flex",
        opacity: "1 !important",
      },
      height: "54px",
    },
  },
  header: {
    style: {
      backgroundColor: headerBackground,
      padding:
        "var(--egg-size-tiny) var(--egg-size-medium) var(--egg-size-tiny) var(--egg-size-medium)",
    },
  },
  headRow: {
    style: {
      backgroundColor: "var(--caviar-color-env-lt-500)",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
      border: "1px inner",
    },
  },
});

export const StatusChip = styled(Chip)`
  color: white;
  font-size: 14px;
  border: none;
  text-transform: capitalize;
  background-color: white;
`;

export const SeparationCard = styled(Card)`
  margin-bottom: var(--egg-size-tiny);
`;

export const MarginCard = styled(Card)`
  margin: var(--egg-size-tiny);
`;

export const SectionDelimiter = styled.div`
  margin: var(--egg-size-tiny) var(--egg-size-tiny) 0px var(--egg-size-tiny);
`;

export const CardExpanderButton = styled(IconButton)`
  color: var(--egg-white-100);
`;

export const commonTextFieldProps: TextFieldProps = {
  variant: "outlined",
  fullWidth: true,
  inputProps: { style: { padding: "10px 0 10px 5px" } },
};

export const commonSelectFieldProps = (value?: string | number | "") => ({
  variant: "outlined",
  fullWidth: true,
  defaultValue: value || undefined,
  inputProps: { style: { padding: "10px 0 10px var(--egg-size-tiny)" } },
  SelectDisplayProps: {
    style: { padding: "10px 0 10px var(--egg-size-tiny)" },
  },
  MenuProps: {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    getContentAnchorEl: null,
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    PaperProps: {
      style: {
        marginTop: "4px",
        border: "none",
        borderRadius: "8px",
        boxShadow: "var(--egg-elevation-level-1)",
      },
    },
  },
});

export const extendedCommonSelectFieldProps = (
  value?: string | number | ""
) => {
  const {
    variant,
    MenuProps: { anchorOrigin, transformOrigin, ...restMenuProps },
    ...props
  } = commonSelectFieldProps(value);
  return {
    ...props,
    MenuProps: restMenuProps,
  };
};

type RequiredAsterisksProps = {
  label: string;
};

type BoldRadioProps = RequiredAsterisksProps & {
  shouldBeBold: string;
};

export const RequiredAsterisks = ({
  label,
}: RequiredAsterisksProps): ReactElement => {
  return (
    <>
      <em style={{ color: ThemeColors.danger }}> {label} *</em>
    </>
  );
};

export const BoldRadio = ({
  label,
  shouldBeBold,
}: BoldRadioProps): ReactElement => {
  const textArray = label.split(shouldBeBold || "");
  return (
    <span>
      {textArray.map((item, index) => (
        <>
          {item}
          {index !== textArray.length - 1 && <b>{shouldBeBold}</b>}
        </>
      ))}
    </span>
  );
};

export const RuleCard = styled(Card)`
  margin: var(--egg-size-tiny) var(--egg-size-tiny) var(--egg-size-tiny)
    var(--egg-size-tiny);
  background-color: var(--caviar-color-surface-light-level-2);
  border-radius: 4px;
  border: 0;
`;

export const OverwriteCard = styled(Card)`
  margin: var(--egg-size-tiny) var(--egg-size-tiny) var(--egg-size-tiny)
    var(--egg-size-tiny);
  background-color: var(--caviar-color-surface-light-level-2);
  border-radius: 4px;
  border: 0;
  max-height: auto;
  overflow: visible;
`;

export const commonFieldProps: TextFieldProps | SelectProps = {
  variant: "outlined",
  size: "small",
  InputProps: {
    style: {
      backgroundColor: "var(--egg-white-100)",
      overflow: "hidden",
    },
  },
};

export const commonCardProps = {
  style: { padding: "var(--egg-size-small)" },
};

export const commonNoPaddingProps = {
  style: { padding: 0 },
};

export const commonPaddingBottomProps = {
  style: { paddingBottom: "var(--egg-size-small)" },
};

export const CustomTextField = styled(TextField)`
  && {
    margin: 10px;
    background-color: #e8f0fe;
    width: 100%;
  }
`;

type BoldTypographyProps = {
  label: string;
  seen: boolean;
};

export const NotificationsTypography = ({
  label,
  seen,
}: BoldTypographyProps): ReactElement => {
  const words = label.split(" ");
  return (
    <Typography
      style={{
        fontSize: "14px",
        color: !seen ? ThemeColors.dark : ThemeColors.gray,
      }}
    >
      {words.map((item, index) => (
        <React.Fragment key={index}>
          {item.includes("@") ? <b>{` ${item}`}</b> : ` ${item}`}
        </React.Fragment>
      ))}
    </Typography>
  );
};
