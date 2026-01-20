import React, { useState } from "react";
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import accordion from "./Accordion.module.scss";

type Item = {
  title: React.ReactNode;
  content: React.ReactNode;
  actionIcons?: { icon: React.ReactNode; onClick: () => void; tooltip?: string }[];
};

type Props = {
  items: Item[];
  titleBgColor?: string;
  titleColor?: string;
  className?: string;
  defaultOpenIndex?: number;
};

const Accordion: React.FC<Props> = ({
  items,
  titleBgColor,
  titleColor,
  className,
  defaultOpenIndex = -1,
}) => {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  console.log("Accordion items:", titleBgColor, titleColor);
  return (
    <div>
      {items.map((it, idx) => (
        <MuiAccordion key={idx} expanded={openIndex === idx}>
          <AccordionSummary
            sx={{ backgroundColor: titleBgColor || "white", borderRadius: "4px", color: titleColor || "black" }}
            expandIcon={<ExpandMoreIcon />}
            onClick={() => toggle(idx)}
            className={accordion.summary}  // ⭐ important
          >
            <Typography className={accordion.title}>{it.title}</Typography>

            {/* MULTIPLE ICONS */}
            <div className={accordion.iconContainer}>
              {it.actionIcons?.map((a, i) => (
                <Tooltip key={i} title={a.tooltip || ""} arrow>
                <span
                  key={i}
                  color="red"
                  className={accordion.iconWrapper}
                  onClick={(e) => {
                    e.stopPropagation();
                    a.onClick();
                  }}
                >
                  {a.icon}
                </span>
                </Tooltip>
              ))}
            </div>
          </AccordionSummary>


          <AccordionDetails>
            {it.content}
          </AccordionDetails>
        </MuiAccordion>
      ))}
    </div>
  );
};

export default Accordion;
