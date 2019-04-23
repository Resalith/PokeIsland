import React from "react";

import { Box, Button, Heading, TextInput } from "grommet";
import { FormSearch } from "grommet-icons";

export const AppHeader = ({
                              appName,
                              appIcon,
                              userSession,
                              onToggleSidebar
                          }) => (
    <Box
        tag="header"
        direction="row"
        background="brand"
        align="center"
        elevation="medium"
        background="status-critical"
        justify="between"
        responsive={false}
        pad={!userSession && { vertical: "xsmall" }}
        style={{ position: "relative" }}
    >
        <Button onClick={onToggleSidebar}>
            <Box
                flex={false}
                direction="row"
                align="center"
                margin={{ left: "small" }}
            >
                {appIcon}
                <Heading level="4" margin={{ left: "small", vertical: "none" }}>
                    {appName}
                </Heading>
            </Box>
        </Button>

        <Box direction="row" align="center">
            {/*{userSession && (
                <UserMenu
                    alignSelf="center"
                    user={userSession.user}
                    items={userSession.items}
                />
            )}*/}
        </Box>
    </Box>
);
