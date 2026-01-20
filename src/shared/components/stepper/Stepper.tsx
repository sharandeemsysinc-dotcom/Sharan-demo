// Import Packages
import React from "react";
import {
  Box,
  Container,
  Typography,
  LinearProgress,
} from "@mui/material";
import Button from "../button/Button";
import steppr from "./Stepper.module.scss";

type StepItem = {
  title?: string;
  content: React.ReactNode;
};

type Props = {
  steps: StepItem[];
  activeStep: number;
  onBack: () => void;
  onNext: () => void;
  completed?: boolean; // ✅ NEW
  component?: React.ElementType;
};

const Stepper: React.FC<Props> = ({
  steps,
  activeStep,
  onBack,
  onNext,
  completed = false,
  component: Component = "div",
}) => {
  const isLastStep = activeStep === steps.length - 1;

  // ✅ REQUIRED PROGRESS LOGIC
  const progress = completed
    ? 100
    : Math.min(activeStep * 25, 75);

  return (
    <Component>
      <Box py={5}>
        {/* ===== Progress Bar ===== */}
        <Container maxWidth="sm">
          <Box className={steppr.progressWrapper}>
            <LinearProgress
              variant="determinate"
              value={progress}
              className={steppr.dashedProgress}
            />

            <Typography
              className={steppr.progressText}
              style={{
                left: `${progress}%`,
                transform:
                  progress === 0
                    ? "translateX(0)"
                    : progress === 100
                    ? "translateX(-100%)"
                    : "translateX(-50%)",
              }}
            >
              {progress}%
            </Typography>
          </Box>
        </Container>

        {/* ===== Step Content ===== */}
        <Container maxWidth="lg">
          {steps.map((step, index) => (
            <Box
              key={index}
              display={activeStep === index ? "block" : "none"}
            >
              {step.content}
            </Box>
          ))}
        </Container>

        {/* ===== Buttons ===== */}
        <Container maxWidth="lg">
          <Box mt={4} display="flex" justifyContent="center" gap={3}>
            <Button
              label="Back"
              disabled={activeStep === 0}
              onClick={onBack}
            />
            <Button
              label={isLastStep ? "Submit" : "Next"}
              onClick={onNext}
            />
          </Box>
        </Container>
      </Box>
    </Component>
  );
};

export default Stepper;
