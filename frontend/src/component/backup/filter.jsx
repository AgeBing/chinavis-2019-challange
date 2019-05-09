import React, { Component } from "react";
import * as d3 from "d3-collection";
class Filter {
  // state = {
  // 全局变量：
  //：默认值为所有的数据
  // allData: [],
  // :当前轨迹显示对应的数据
  // curData: [],
  // :当前的过滤条件,它是一个集合
  // curFilterAttr: []
  // condition
  // };
  // :过滤函数，根据curfilterAttr执行过滤allData，修改curData.
  // doFilter(filters, data, conditions) {
  //   const { allData, curData, curFilterAttr } = this.state;
  //   curData = [];
  //   for (var i = 0; i < curFilterAttr.length; i++) {
  //     let a_filter = curFilterAttr[i];
  //     let filters = a_filter.filter;
  //     let tempData = allData || [];
  //     if (filters.position)
  //       tempData = tempData.filter(
  //         item =>
  //           d3.min([item.x1, item.x2]) > filters.position[0][0] &&
  //           d3.max([item.x1, item.x2]) < filters.position[0][1] &&
  //           d3.min([item.y1, item.y2]) > filters.position[1][0] &&
  //           d3.max([item.y1, item.y2]) < filters.position[1][1]
  //       );
  //     if (filters.time)
  //       tempData = tempData.filter(
  //         item => item.time1 > filters.time[0] && item.time2 < filters.time[1]
  //       );
  //     curData = curData.concat(tempData);
  //   }
  // }
  doFilter(filters, data, conditions) {
    const filteredData = [...data];
    for (filterMethod in filters) {
      filteredData = filterMethod(filteredData, conditions);
    }
    return filteredData;
  }
  //去除一个filter
  // reduceFilter(oldFilter) {
  //   const { allData, curFilterAttr } = this.state;
  //   curFilterAttr = curFilterAttr.filter(item => !item.id === oldFilter.id);
  //   this.setState(curFilterAttr, curFilterAttr);
  // }
  // //增加一个filter
  // appendFilter(newFilter) {
  //   const { allData, curFilterAttr } = this.state;
  //   curFilterAttr.append(newFilter);
  //   this.setState(curFilterAttr, curFilterAttr);
  // }
  // //去除重复的filter
  // uniqueFilter() {
  //   const { curFilterAttr } = this.state;
  //   const newFilter = d3
  //     .nest()
  //     .key(item => item.id)
  //     .rollup(d => d[0])
  //     .entries(curFilterAttr);
  //   newFilter = newFilter.map(item => item.values);
  // }
  // render() {
  //   return <React.Fragment />;
  // }
}

export default Filter;
