import React from "react";

import { List, ListItem } from "@material-ui/core";

const TonersToOrder = ({ toners, setToners }) => {
  return (
    <div>
      <List>
        {toners
          .filter((toner) => toner.amount <= 1)
          .map((toner) => (
            <ListItem key={toner.code}>
              {toner.code} | left: {toner.amount}
            </ListItem>
          ))}
      </List>
    </div>
  );
};

export default TonersToOrder;
