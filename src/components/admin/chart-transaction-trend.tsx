"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Cell } from "recharts";
import { useLocale, useTranslations } from "next-intl";

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

export function ChartTransactionTrend({
  monthlyRevenue,
}: {
  monthlyRevenue: { month: string; revenue: number }[];
}) {
  const t = useTranslations("adminDashboard.transactionTrend");
  const locale = useLocale();

  const chartConfig = {
    revenue: {
      label: t("revenueLabel"),
      color: "#2563eb",
    },
  };
  // Array warna biru muda dan biru tua
  const barColors = ["#60a5fa", "#2563eb", "#60a5fa", "#2563eb"]; // light blue, dark blue
  return (
    <Card className="flex h-full flex-col py-6">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("description", {
            months: monthlyRevenue.map((m) => m.month).join(", "),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={monthlyRevenue}
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="revenue" radius={8}>
              {monthlyRevenue.map((entry, idx) => (
                <Cell
                  key={entry.month}
                  fill={barColors[idx % barColors.length]}
                />
              ))}
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) =>
                  new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(value)
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {t("footer.primary")} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {t("footer.secondary")}
        </div>
      </CardFooter>
    </Card>
  );
}
