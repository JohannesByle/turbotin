import { Box } from "@mui/material";
import { useQuery } from "@connectrpc/connect-query";
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
import { isNull, isUndefined, max, min, sortBy } from "lodash";
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import { INDIVIDUAL_BLENDS, PALETTE, STORE_TO_NAME } from "../../consts";
import { getTobaccoPrices } from "../../protos/turbotin-Public_connectquery";
import { Tobacco, TobaccoPrices } from "../../protos/turbotin_pb";
import { formatUSD } from "../../util";
import BlendSelect from "../../util/components/blendSelect";
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

const PriceHistory = (): JSX.Element => {
  const { tag_id: tag_id_ } = useParams();
  const { tobaccos: all_tobaccos, tobaccoTags, tagMap, isFetching } = useTags();

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
    getTobaccoPrices,
    { items: tobaccos.map((t) => t.id) }
  );

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
        <BlendSelect
          tag={tag}
          setTag={(tag) => {
            !isNull(tag) && navigate(`${INDIVIDUAL_BLENDS}/${tag.id}`);
          }}
          isLoading={isFetchingPrices}
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
