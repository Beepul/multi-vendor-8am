import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";


ChartJs.register(ArcElement, Tooltip, Legend)

// {
//     labels: ['A', 'B', 'C'],
//     datasets: [
//         {
//             label: "rev",
//             data: [20,30,40]
//         }
//     ]
// }

type DataSet = {
    label: string,
    data: string[] | number[],
    backgroundColor?: string[],
    borderRadius?: number
}

type ChartData = {
    chartData: {
        labels: string[],
        datasets: DataSet[]
    }
}

const DoughnutComponent = ({chartData}: ChartData) => {
    return (<>
        <Doughnut 
            data={chartData}
        />
    </>)
}

export default DoughnutComponent