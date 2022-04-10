import React from "react";
import { Badge } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    circle: {
        marginRight: 25,
    }
}));

const UnReadMessage = ({unreadMsgs}) => {
    const classes = useStyles();
    return (
        <Badge className={classes.circle} badgeContent={unreadMsgs} max={99} color="primary">
        </Badge>
    );
};

export default UnReadMessage;
