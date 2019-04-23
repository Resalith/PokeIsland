import React, { Component } from 'react';
import { Grommet, ResponsiveContext, Box } from 'grommet';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {AppHeader} from "./Components/AppHeader";
import {AddTeam} from "./Pages/AddTeam";
import {Sidebar} from "./Components/Sidebar";
import {NotFound} from "./Pages/NotFound";

const userSession = {
    user: {
        name: "Trainer Resalith",
        thumbnail: "//s.gravatar.com/avatar/b226da5c619b18b44eb95c30be393953?s=80"
    },
    items: [
        {
            label: "Logout",
            href: "#"
        }
    ]
};

const items = [
    {
        active: true,
        label: "Home",
        path: "/",
        exact: true
    },
    {
        active: true,
        label: "My Teams",
        path: "/myTeams"
    },
    {
        active: true,
        label: "Events",
        path: "/events"
    },
    {
        active: false,
        label: "My Account",
        path: "/account"
    }
];


class App extends Component {
    static contextType = ResponsiveContext;
    state = {
        showSidebar: false
    };
    componentDidUpdate() {
        const size = this.context;
        const { showSidebar } = this.state;
        if (size !== "small" && !showSidebar) {
            this.setState({ showSidebar: true });
        }
    }
    onToggleSidebar = () => {
        this.setState({ showSidebar: !this.state.showSidebar }, () => console.log("onToggleSidebar #TRIGGERED", this.state.showSidebar));

    }


    render() {

        const sideBar = (this.state.showSidebar)
            ? (
                <Sidebar
                    items={items}
                    onToggleSidebar={this.onToggleSidebar}
                />
            )
            : (
                null
            )

        const { showSidebar } = this.state;
        return (
            <Router>
                <Grommet full>
                    <Box fill>
                        <AppHeader
                            appName="PokeIsland"
                            userSession={userSession}
                            onToggleSidebar={this.onToggleSidebar}
                        />
                        <Box direction="row" flex>
                            {sideBar}
                            <Box flex>
                                <Switch>
                                    <Route path="/" exact component={AddTeam} />
                                    <Route component={NotFound} />
                                </Switch>
                            </Box>
                        </Box>
                    </Box>
                </Grommet>
            </Router>
        );
    }
}

export default App;
