import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRestaurantData } from "@/hooks/useRestaurantData";
import { useStatisticsData } from "@/hooks/useStatisticsData";
import { ApexOptions } from "apexcharts";
import ApexChart from "react-apexcharts";

interface IProductDeliveryData {
  name: string;
  totalDeliveredItems: number;
}

export interface ICountOrdersResponse {
  totalOrders?: number;
  totalAmount?: number;
  productDeliveryData?: IProductDeliveryData[];
}

export const Dashboard = () => {
  const { data: restaurantData } = useRestaurantData();
  const { data: countOrdersData } = useStatisticsData(
    "countOrders",
    restaurantData?.id
  );
  const { data: countOrdersOnTheDayData } = useStatisticsData(
    "countOrdersOnTheDay",
    restaurantData?.id
  );
  const { data: totalAmountData } = useStatisticsData(
    "totalAmount",
    restaurantData?.id
  );
  const { data: countMorePopularsItemsData } = useStatisticsData(
    "countMorePopularsItems",
    restaurantData?.id
  );

  const options: ApexOptions = {
    xaxis: {
      categories:
        countMorePopularsItemsData?.productDeliveryData?.map(
          (product) => product.name
        ) || [],
      type: "category",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: function (value: number) {
          return value.toFixed(0);
        },
      },
    },
    title: {
      text: "Total de itens por pedido",
      style: {
        color: "#fff",
      },
    },
  };

  const series = [
    {
      name: "Total de itens nos pedidos",
      data:
        countMorePopularsItemsData?.productDeliveryData?.map(
          (product) => product.totalDeliveredItems
        ) || [],
    },
  ];

  return (
    <>
      <Header />
      <main className="container p-4">
        <h1 className="text-2xl">Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Total de pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {countOrdersData?.totalOrders}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total de pedidos no dia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {countOrdersOnTheDayData?.totalOrders}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Receita total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-green-500">
                {totalAmountData?.totalAmount
                  ? (totalAmountData.totalAmount / 100).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )
                  : 0}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <ApexChart
            options={options}
            type="bar"
            series={series}
            height={600}
            width={600}
          />
        </div>
      </main>
    </>
  );
};
