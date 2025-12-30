import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function go(path) {
  window.location.hash = `#${path}`;
}

export default function NavBar({ activePath = "/" }) {
  const items = [
    { label: "Home", path: "/" },
    { label: "Map", path: "/map" },
    { label: "Favorites", path: "/favorites" },
    { label: "Settings", path: "/settings" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <div style={{ padding: 12 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
        {items.map((it) => {
          const active = activePath === it.path;
          return (
            <Button
              key={it.path}
              variant={active ? "contained" : "outlined"}
              onClick={() => go(it.path)}
              size="small"
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
            >
              {it.label}
            </Button>
          );
        })}
      </Stack>
    </div>
  );
}
