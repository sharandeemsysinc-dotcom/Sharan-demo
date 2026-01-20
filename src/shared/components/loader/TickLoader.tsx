import { Box } from "@mui/material";

export default function TickLoader() {
  return (
    <Box sx={{ width: 80, height: 80 }}>
      <svg viewBox="0 0 52 52">
        <circle
          cx="26"
          cy="26"
          r="25"
          fill="none"
          stroke="#4caf50"
          strokeWidth="2"
          style={{
            strokeDasharray: 157,
            strokeDashoffset: 157,
            animation: "circle 0.6s ease-out forwards",
          }}
        />
        <path
          fill="none"
          stroke="#4caf50"
          strokeWidth="4"
          d="M14 27 l7 7 l17 -17"
          style={{
            strokeDasharray: 48,
            strokeDashoffset: 48,
            animation: "tick 0.4s ease-out 0.6s forwards",
          }}
        />
      </svg>

      <style>
        {`
          @keyframes circle {
            to { stroke-dashoffset: 0; }
          }
          @keyframes tick {
            to { stroke-dashoffset: 0; }
          }
        `}
      </style>
    </Box>
  );
}
