import { Autocomplete, Box, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  CategoryScale,
  Chart,
  ChartDataset,
  Colors,
  Legend,
  LineElement,
  LinearScale,
  Point,
  PointElement,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";
import { groupBy, isNull, isUndefined, max, min, sortBy } from "lodash";
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import {
  BLEND,
  BRAND,
  INDIVIDUAL_BLENDS,
  PALETTE,
  STORE_TO_NAME,
} from "../../consts";
import { getTobaccoPrices } from "../../protos/turbotin-Public_connectquery";
import { Tag, Tobacco, TobaccoPrices } from "../../protos/turbotin_pb";
import { formatUSD } from "../../util";
import LoadingIcon from "../../util/components/loadingIcon";
import { useTags } from "../../util/tags";

Chart.register({
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
  Colors,
});

const getOptionLabel = (tag: Tag): string => tag?.value ?? "";

const PriceHistory = (): JSX.Element => {
  const { tag_id: tag_id_ } = useParams();
  const {
    tobaccos: all_tobaccos,
    tobaccoTags,
    tagMap,
    tags,
    tagLinks,
    cats,
    isFetching,
    links,
  } = useTags();

  const navigate = useNavigate();

  const tag_id = Number(tag_id_);

  const tobaccos = useMemo(() => {
    const result = new Array<Tobacco>();
    for (const tobacco of all_tobaccos) {
      const tags = tobaccoTags.get(tobacco.id) ?? [];
      for (const tag of tags) if (tag.id === tag_id) result.push(tobacco);
    }
    return result;
  }, [tag_id, tobaccoTags, all_tobaccos]);

  const { data = new TobaccoPrices(), isFetching: isFetchingPrices } = useQuery(
    getTobaccoPrices.useQuery({ items: tobaccos.map((t) => t.id) })
  );

  const blend = cats.find((c) => c.name === BLEND);

  const getBrand = useMemo(() => {
    const groups = groupBy(tagLinks, (t) => t.parentTagId);
    const brand = cats.find((c) => c.name === BRAND);
    if (isUndefined(brand)) return () => "";
    return (tag: Tag): string => {
      const link = groups[tag.id]?.find(
        (l) => tagMap.get(l.tagId)?.categoryId === brand?.id
      );
      return tagMap.get(link?.tagId ?? NaN)?.value ?? "";
    };
  }, [cats, tagLinks, tagMap]);

  const blends = useMemo(() => {
    const linkedTags = new Set(links.map((l) => l.tagId));
    return sortBy(
      tags.filter((t) => t.categoryId === blend?.id && linkedTags.has(t.id)),
      [getBrand, (t) => t.value]
    );
  }, [tags, blend, getBrand, links]);

  const tag = tagMap.get(tag_id);

  const allDates = data.items.flatMap((l) =>
    l.items.map((i) => i.time?.toDate()?.getTime() ?? 0)
  );

  const sortedData = data.items.map((l) =>
    sortBy(l.items, (p) => p.time?.seconds)
  );

  return (
    <Box
      sx={{
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Box
        maxWidth={"lg"}
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          m: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Autocomplete
          value={(tag ?? null) as Tag}
          options={blends}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{ backgroundColor: PALETTE.background.paper }}
              label="Blend"
              {...((isFetching || isFetchingPrices) && {
                InputProps: { endAdornment: <LoadingIcon /> },
              })}
            />
          )}
          getOptionLabel={getOptionLabel}
          groupBy={getBrand}
          sx={{ width: 300, m: 1 }}
          onChange={(_, tag) =>
            !isNull(tag) && navigate(`${INDIVIDUAL_BLENDS}/${tag.id}`)
          }
          disableClearable
        />

        {!isFetching && !isFetchingPrices && !isUndefined(tag) && (
          <Box
            sx={{
              m: 1,
              p: 2,
              backgroundColor: PALETTE.background.paper,
              border: 1,
              borderColor: PALETTE.primary.main,
              borderRadius: "4px",
            }}
          >
            <Line
              data={{
                datasets: sortedData.map((items, i): ChartDataset<"line"> => {
                  return {
                    data: items.map(
                      (p): Point => ({
                        y: p.price,
                        x: p.time?.toDate()?.getTime() ?? 0,
                      })
                    ),
                    label: STORE_TO_NAME[tobaccos[i].store],
                    pointBorderColor: (ctx) => {
                      if (
                        "element" in ctx &&
                        ctx.element instanceof PointElement &&
                        !isUndefined(ctx.element.options)
                      ) {
                        const opts = ctx.element.options;
                        return opts.pointStyle === "circle"
                          ? opts.backgroundColor
                          : "red";
                      }
                    },
                    pointRadius: 0,
                    pointHitRadius: 10,
                    segment: {
                      borderDash: (ctx) => {
                        if (!items[ctx.p0DataIndex].inStock) return [6, 6];
                      },
                    },
                  };
                }),
              }}
              options={{
                scales: {
                  x: {
                    type: "time",
                    min: min(allDates),
                    max: max(allDates),
                  },
                  y: {
                    ticks: {
                      format: {
                        style: "currency",
                        currency: "USD",
                      },
                    },
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: ({ parsed, dataIndex, datasetIndex }) => {
                        const price = sortedData[datasetIndex][dataIndex];
                        const name =
                          STORE_TO_NAME[tobaccos[datasetIndex].store];
                        const result = `${formatUSD(parsed.y)} - ${name}`;
                        return price.inStock
                          ? result
                          : result + " (out of stock)";
                      },
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PriceHistory;
