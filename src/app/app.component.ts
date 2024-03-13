import { Component, OnInit } from '@angular/core';
import Chart, { BubbleDataPoint, Point } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:[CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'stackgraph';
  myChart!: Chart; 
  legendColors: string[] = ['#4472C4', '#F4B183','#C00000'];
 
  ngOnInit() {

    Chart.register({
      id: 'customTitleBackground',
      beforeDraw(chart, args, options) {
        const { ctx, chartArea, chartArea: { top }, chartArea: { bottom, left, right, width, height } } = chart;
        const centerX = (left + right) / 2;
        const backgroundWidth = 200;

        ctx.save();
        ctx.fillStyle = '#0085d5';
        // ctx.fillRect(centerX - backgroundWidth / 2, 0, backgroundWidth, 30);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.lineTo(right, bottom);
        ctx.lineTo(left, bottom);
        ctx.lineTo(left, top);
        //ctx.moveTo(left, top);
        //ctx.closePath();
        // ctx.lineTo(bottom, bottom);

        ctx.strokeStyle = '#000'
        ctx.stroke();
        ctx.restore();
      }
      
    });

    ///topLabels pluings

    const topLabels = {
      id: 'topLabels',
      afterDatasetDraw(chart: Chart) {
        const { ctx, scales: { x, y } } = chart;

        chart.data.datasets[0].data.forEach((datapoint, index) => {
          const datasetArray: (number | [number, number] | Point | BubbleDataPoint | null)[] = [];

          chart.data.datasets.forEach((dataset) => {
            datasetArray.push(dataset.data[index])
            console.log(datasetArray,'fff')
          })
          //console.log(datasetArray)
          function totlaSum(total: any, value: any) {
            return total + value
          };
          let sum = datasetArray.reduce(totlaSum, 0)
          // console.log(sum)


          const rectX = x.getPixelForValue(index) - 10;
          const rectY = chart.getDatasetMeta(1).data[index].y - 40;
          const rectWidth = 21;
          const rectHeight = 25;


          ctx.fillStyle = '#FFFF99';
          ctx.fillRect(rectX, rectY, rectWidth, rectHeight);


          ctx.strokeStyle = 'black';
          ctx.lineWidth = 1;
          ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);


          ctx.fillStyle = '#000';
          ctx.textAlign = 'center';
          ctx.fillText(sum, rectX + rectWidth / 2, rectY + rectHeight / 2);
          ctx.fillStyle = '#FFFF99';
          ctx.font = '8px'



        })




      }


    }

    var myContext = document.getElementById("acquisitions") as HTMLCanvasElement;
    this.myChart = new Chart(myContext, {
      type: 'bar',

      data: {
        labels: ["bike", "car", "scooter",
          "truck", "auto", "Bus"],

        datasets: [{

          label: 'IHC',
          // backgroundColor: "#4472c4", 
          data: [33,45,30,66,50,40],
          minBarLength: 2,
          maxBarThickness: 20,
          //backgroundColor: '#0085d5',
          backgroundColor: this.legendColors[0] || '#4472C4'



        },

        {
          label: 'UF',
          //backgroundColor: "#F4B183",
          data: [10, 20, 60, 40, 85, 56],
          maxBarThickness: 20,
          backgroundColor: this.legendColors[1] || '#F4B183'

        },
        {
          label: 'FISH',
          //backgroundColor: "#F4B183",
          data: [0,0,0,0,5,9],
          maxBarThickness: 20,
          backgroundColor: this.legendColors[2] || 'red'

        }
      ],
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
           display:false
          },
          title: {
            display: true,
            text: 'Stacked Bar chart for pollution status',

            color: "#000",
            font: {
              size: 25
            },
            

          },
          subtitle: {
            display: true,
            text: '2019-2022',
            color: "#000",
            font: {
              size: 15
            }
          },
          datalabels: {
            color: '#fff', 
            font:{
              weight:'bold'
            }
        },

        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false
            },
            ticks: {
              color: '#000',
              font: {
                weight: 'bold',
                
              },
             
            },
           


          },
          y: {
            max: 200,
            stacked: true,
            ticks: {
              stepSize: 50,
              color: '#000',
              font: {
                weight: 'bold'
              }
            }

          }
        },

      },
      plugins: [ChartDataLabels, topLabels]
    });
  }
  
  updateLegendColor(index: number) {
    
    this.myChart.data.datasets[index].backgroundColor = this.legendColors[index];
    this.myChart.data.datasets[index].borderColor = this.legendColors[index];
  
    // Update the chart
    this.myChart.update();
  }
  
}