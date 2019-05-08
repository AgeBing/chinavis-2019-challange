import React, { Component } from 'react';
import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util } from "bizcharts";
import DataSet from '@antv/data-set';

class Twoline extends Component {
    render() {
        const data = [
            [
                { createtime: 1526213605000, value: 10, cate: 1 },
                { createtime: 1526313706000, value: 20, cate: 1 },
                { createtime: 1526413800000, value: 30, cate: 1 },
                { createtime: 1526313900000, value: 40, cate: 1 }
            ],
            [
                { createtime: 1526213605000, value: 11, cate: 2 },
                { createtime: 1528313806000, value: 22, cate: 2 },
                { createtime: 1526313900000, value: 33, cate: 2 },
                { createtime: 1526514900000, value: 44, cate: 2 }
            ],
            [
                { createtime: 1526213605000, value: 15, cate: 3 },
                { createtime: 1528313800000, value: 25, cate: 3 },
                { createtime: 1526413900000, value: 36, cate: 3 },
                { createtime: 1526316900000, value: 46, cate: 3 }
            ],
        ]

        // cate 是数字，用作分组时，G2 当做从 0 开始的索引，所以转成字符串会更好处理，否则分组颜色会展示不对
        const data2 = data.reduce((res, cur) => {
            const list = cur.map(i => {
                return {
                    ...i,
                    cate: `${i.cate}`
                };
            });
            return res.concat(list);
        }, []);

        console.log(data2)

        const scale = {
            createtime: {
                alias: '时间',
                type: 'timeCat'
            },
            cate: {
                type: 'cat'
            }
        };

        return (
            <Chart height={400} data={data2} scale={scale} forceFit>
                <Legend />
                <Tooltip />
                <Axis name="createtime" />
                <Axis name="value" />
                <Geom type="line" position="createtime*value" color={'cate'} shape='hv'/>
                <Geom type="point" position="createtime*value" color={'cate'} />
            </Chart>
        )
    }
}

export default Twoline
