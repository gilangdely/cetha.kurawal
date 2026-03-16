"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export function TransactionDonutChart({
  success,
  pending,
  failed,
  isLoading = false,
}: {
  success: number;
  pending: number;
  failed: number;
  isLoading?: boolean;
}) {
  const t = useTranslations("adminDashboard.transactionDonut");

  const chartConfig = {
    success: {
      label: t("status.success"),
      color: "var(--chart-1)",
    },
    pending: {
      label: t("status.pending"),
      color: "var(--chart-2)",
    },
    failed: {
      label: t("status.failed"),
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  const total = success + pending + failed;

  const chartData = [
    {
      month: "transactions",
      success,
      pending,
      failed,
    },
  ];

  return (
    <Card className="flex flex-col py-6">
      <CardHeader className="items-center">
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        {isLoading ? (
          <div className="mx-auto flex aspect-square w-full max-w-[250px] items-center justify-center">
            <div className="from-muted to-muted/50 h-48 w-48 animate-pulse rounded-full bg-gradient-to-br" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[250px]"
          >
            <RadialBarChart
              data={chartData}
              endAngle={180}
              innerRadius={80}
              outerRadius={130}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {total}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground text-xs"
                          >
                            {t("totalLabel")}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="failed"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-failed)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="pending"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-success)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="success"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-pending)"
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {isLoading ? (
          <div className="w-full space-y-2">
            <div className="bg-muted h-4 w-32 animate-pulse rounded" />
            <div className="bg-muted h-4 w-40 animate-pulse rounded" />
            <div className="bg-muted h-4 w-36 animate-pulse rounded" />
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-teal-400" />
              <span className="text-muted-foreground">
                {t("status.success")}
              </span>
              <span className="ml-auto font-semibold">{success}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-orange-700" />
              <span className="text-muted-foreground">
                {t("status.pending")}
              </span>
              <span className="ml-auto font-semibold">{pending}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-teal-950" />
              <span className="text-muted-foreground">
                {t("status.failed")}
              </span>
              <span className="ml-auto font-semibold">{failed}</span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
