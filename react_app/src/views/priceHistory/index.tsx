import { Box } from "@mui/material";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTags } from "../../util/tags";
import { useQuery } from "@tanstack/react-query";
import { getTobaccoPrices } from "../../protos/turbotin-Public_connectquery";

const PriceHistory = (): JSX.Element => {
  const { tag_id } = useParams();
  const { tobaccos, tobaccoTags } = useTags();

  const ids = useMemo(() => {
    const result = new Array<number>();
    for (const tobacco of tobaccos) {
      const tags = tobaccoTags.get(tobacco.id) ?? [];
      for (const tag of tags)
        if (tag.id === Number(tag_id)) result.push(tobacco.id);
    }
    return result;
  }, [tag_id, tobaccoTags, tobaccos]);

  const { data } = useQuery(getTobaccoPrices.useQuery({ items: ids }));

  console.log(data);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    ></Box>
  );
};

export default PriceHistory;
