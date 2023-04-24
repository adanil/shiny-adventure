import { cx } from '@emotion/css';
import React, { PureComponent } from 'react';

import { ArrayVector, DataFrame, dateTime, FieldType, TimeRange } from '@grafana/data';
import { LegendDisplayMode, TooltipDisplayMode } from '@grafana/schema';
import { GraphWithLegend, Themeable2, VizTooltip } from '@grafana/ui';

import { SeriesOptions } from '../../types/flotgraph';
import { getGraphSeriesModel } from '../GraphSeriesModel';
import { DAILY_SUMMARY_DATE_FORMAT, DashboardDailySummaryDTO } from '../api';
import { getInsightsStyles } from '../styles';

interface Props extends Themeable2 {
  dailySummaries: DashboardDailySummaryDTO[];
}

interface ChartConfig {
  title: string;
  fields: Array<{ name: keyof DashboardDailySummaryDTO; type: FieldType; color?: string; label?: string }>;
  width: number;
  timeRange: TimeRange;
  showBars: boolean;
  showLines: boolean;
  isStacked?: boolean;
}

// AnalyticsTab is a class made to share functions between the different Tabs of the Analytics Drawer
export class AnalyticsTab<T extends Props, V = any> extends PureComponent<T, V> {
  convertSummariesToDataFrame(
    data: DashboardDailySummaryDTO[],
    valueField: keyof DashboardDailySummaryDTO,
    valueFieldType: FieldType,
    valueFieldLabel?: string
  ): DataFrame {
    const time = new ArrayVector<number>([]);
    const values = new ArrayVector<any>([]);

    data.forEach((dailySummary) => {
      time.buffer.push(dateTime(dailySummary.day, DAILY_SUMMARY_DATE_FORMAT).valueOf());
      values.buffer.push(dailySummary[valueField]);
    });

    return {
      fields: [
        { name: 'Time', type: FieldType.time, config: {}, values: time },
        {
          name: valueField,
          type: valueFieldType,
          config: { displayName: valueFieldLabel ?? valueField },
          values,
        },
      ],
      length: data.length,
    };
  }

  buildTimeRange(): TimeRange {
    const { dailySummaries } = this.props;
    const from = dateTime(dailySummaries[0].day);
    const to = dateTime(dailySummaries[dailySummaries.length - 1].day).add(12, 'hours');

    return {
      from: from,
      to: to,
      raw: { from, to },
    };
  }

  renderChart(config: ChartConfig) {
    const { dailySummaries, theme } = this.props;
    const { showBars, showLines, timeRange, title, width, fields, isStacked = false } = config;

    const styles = getInsightsStyles(theme);

    const dataFrames = fields.map((field) =>
      this.convertSummariesToDataFrame(dailySummaries, field.name, field.type, field.label)
    );

    const seriesOptions: SeriesOptions = fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: { color: field.color ?? '' },
      }),
      {}
    );

    const series = getGraphSeriesModel(
      dataFrames,
      'browser',
      seriesOptions,
      { showBars: showBars, showLines: showLines, showPoints: false },
      { placement: 'bottom', displayMode: LegendDisplayMode.List, showLegend: false }
    );

    return (
      <div className={cx(styles.graphContainer, 'panel-container')} aria-label="Graph container">
        <div className="panel-title">{title}</div>
        <div className={cx('panel-content', styles.panelContent)}>
          <GraphWithLegend
            height={150}
            width={width}
            timeRange={timeRange}
            showBars={showBars}
            showLines={showLines}
            showPoints={false}
            series={series}
            isStacked={isStacked}
            timeZone="browser"
            legendVisibility={series.length > 1}
            onToggleSort={() => {}}
            legendDisplayMode={LegendDisplayMode.List}
            placement="bottom"
          >
            <VizTooltip mode={TooltipDisplayMode.Multi} />
          </GraphWithLegend>
        </div>
      </div>
    );
  }
}
