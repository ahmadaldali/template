import React from "react";
import { Box } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    circle: {
        width: '25px',
        height: '25px',
        textAlign: 'center',
        color: 'white',
        font: '12 Open Sans, Open Sans',
        backgroundColor: '#3F92FF',
        border: '2px solid #3F92FF',
        borderRadius: '50%',
        borderWidth: 1,
        marginRight: 10,
        paddingTop: 2
    }
}));

const UnReadMessage = ({unreadMsgs}) => {
    const unreadStr = unreadMsgs > 99 ? '+99' : unreadMsgs;
    const classes = useStyles();
    return (
        <Box>
            {unreadMsgs > 0 &&
                <p className={classes.circle}>
                    {unreadStr}
                </p>
            }
        </Box>
    );
};

export default UnReadMessage;
