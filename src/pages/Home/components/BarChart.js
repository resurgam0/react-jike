// 柱状图组件
// 1.把功能代码都放到这个组件中
// 2.把可变的部分抽象成prop参数
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
const BarChar = ({title})=>{
    const chartRef = useRef(null)
    useEffect(()=>{
        // 保证dom可用，才进行图表的渲染
        const chartDom = chartRef.current
        const myChart = echarts.init(chartDom);
        const option = {
            title: {
                text: title
            },
            xAxis: {
                type: 'category',
                data: ['Vue', 'React', 'Angular']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [120, 200, 150],
                    type: 'bar'
                }
            ]
        };
        option && myChart.setOption(option);
    },[])
    return (<div>
        <div ref={chartRef} style={{width: '500px', height: '400px'}}></div>
    </div>)
}
export default BarChar