/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback } from "react";
import {
  DataGrid as DevExtremeDataGrid,
  ColumnChooser,
  ColumnFixing,
  Editing,
  Export,
  FilterRow,
  GroupItem,
  GroupPanel,
  Item,
  SearchPanel,
  Selection,
  Summary,
  Toolbar,
  Grouping,
  LoadPanel,
  // Scrolling,
  // Paging,
} from "devextreme-react/data-grid";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { exportDataGrid } from "devextreme/excel_exporter";
import { jsPDF } from "jspdf";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { Button } from "@/components/ui/button";

export type DataGridProps<T> = {
  data: T[];
  keyExpr: string;
  onSelectionChanged?: (selectedItem: T) => void;
  allowEditing?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
};

export function DataGrid2<T>({
  data,
  keyExpr,
  onSelectionChanged,
  allowEditing = false,
  expanded = true,
  onExpandedChange,
  className,
}: DataGridProps<T>) {
  const handleSelectionChanged = useCallback(
    (e: any) => {
      if (onSelectionChanged && e.currentSelectedRowKeys.length > 0) {
        e.component.byKey(e.currentSelectedRowKeys[0]).done((item: T) => {
          onSelectionChanged(item);
        });
      }
    },
    [onSelectionChanged]
  );

  const handleExporting = useCallback((e: any) => {
    if (e.format === "xlsx") {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Main sheet");

      exportDataGrid({
        worksheet: worksheet,
        component: e.component,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            "DataGrid.xlsx"
          );
        });
      });
    } else if (e.format === "pdf") {
      const doc = new jsPDF();

      exportDataGridToPdf({
        jsPDFDocument: doc,
        component: e.component,
      }).then(() => {
        doc.save("DataGrid.pdf");
      });
    }
  }, []);

  const toggleExpanded = useCallback(() => {
    if (onExpandedChange) {
      onExpandedChange(!expanded);
    }
  }, [expanded, onExpandedChange]);

  return (
    <div className={className}>
      <DevExtremeDataGrid
        id="dataGrid"
        keyExpr={keyExpr}
        dataSource={data}
        allowColumnReordering={true}
        columnAutoWidth={true}
        onSelectionChanged={handleSelectionChanged}
        onExporting={handleExporting}
        rowAlternationEnabled={true}
        showBorders={true}
        allowColumnResizing={true}
        columnResizingMode="widget"
        focusedRowEnabled={true}
        focusedRowIndex={0}
        focusedColumnIndex={0}
        columnFixing={{ enabled: true }}
        remoteOperations={true}
      >
        <LoadPanel
          enabled
          height={100}
          width={250}
          indicatorSrc="https://js.devexpress.com/Content/data/loadingIcons/rolling.svg"
        />
        <ColumnFixing enabled={true} />
        <ColumnChooser enabled={true} />
        <FilterRow visible={true} applyFilter="auto" />
        <SearchPanel visible={true} />
        <GroupPanel visible={true} />
        <Grouping
          expandMode="rowClick"
          autoExpandAll={false}
          allowCollapsing={true}
        />
        {allowEditing && (
          <Editing
            mode="popup"
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={true}
          />
        )}
        <Selection mode="multiple" />
        <Summary>
          <GroupItem summaryType="count" />
        </Summary>
        <Toolbar>
          <Item name="groupPanel" />
          {onExpandedChange && (
            <Item location="after">
              <Button onClick={toggleExpanded}>
                {expanded ? "Collapse All" : "Expand All"}
              </Button>
            </Item>
          )}
          {allowEditing && <Item name="addRowButton" showText="always" />}
          <Item name="exportButton" />
          <Item name="columnChooserButton" />
          <Item name="searchPanel" />
        </Toolbar>
        <Export enabled={true} formats={["xlsx", "pdf"]} />
        {/* <Paging enabled={true} pageSize={100} /> */}
        {/* <Scrolling mode="virtual" /> */}
      </DevExtremeDataGrid>
    </div>
  );
}
