/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Column,
  ColumnChooser,
  ColumnFixing,
  DataGrid as DevExtremeDataGrid,
  Editing,
  Export,
  FilterPanel,
  FilterRow,
  Grouping,
  GroupItem,
  GroupPanel,
  HeaderFilter,
  LoadPanel,
  Lookup,
  MasterDetail,
  Popup,
  Scrolling,
  SearchPanel,
  Selection,
  Sorting,
  StateStoring,
  Summary,
  Toolbar,
  TotalItem,
} from "devextreme-react/data-grid";
import { exportDataGrid } from "devextreme/excel_exporter";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { jsPDF } from "jspdf";
import { PlusIcon } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// Types for column configuration
export type GridColumn = {
  field: string;
  caption?: string;
  type?: string;
  width?: number | string;
  alignment?: string;
  visible?: boolean;
  edit?: boolean;
  format?: string;
  groupIndex?: number;
  sortIndex?: number;
  sortOrder?: string;
  customizeText?: (cellInfo: any) => string;
  encodeHtml?: boolean;
  allowExporting?: boolean;
  showInColumnChooser?: boolean;
  hideWhenGrouped?: boolean;
  customizeExcelCell?: (e: any) => void;
  calculateCellValue?: (data: any) => any;
  calculateDisplayValue?: (data: any) => any;
  setCellValue?: (rowData: any, value: any) => void;
  selectedFilterOperation?: string;
  filterValue?: any;
  validationRules?: any[];
  editorOptions?: any;
  cssClass?: string;
  lookup?: any[];
  display?: string;
  value?: string;
  allowclear?: boolean;
  cellRender?: (cellData: any) => React.ReactNode;
};

// Types for header groups
export type HeaderGroup = {
  id: string;
  header: string;
  columns: GridColumn[];
};

// Types for summary configuration
export type SummaryConfig = {
  summ?: {
    key: string;
    column: string;
    type?: string;
    displayFormat?: string;
    valueFormat?: string;
  }[];
  group?: {
    key: string;
    column: string;
    type?: string;
    displayFormat?: string;
    valueFormat?: string;
  }[];
};

// Types for grid buttons
export type GridButtonsConfig = {
  width: number;
  data: string;
  buttons: {
    id: string;
    icon?: string;
    hint: string;
    action: (data: any) => void;
  }[];
};

// Types for hyperlinks
export type GridHyperlinkConfig = {
  id: string;
  caption: string;
  width: number;
  data: string;
};

// Main component props
export type DataGridProps = {
  datatable: any[] | object;
  keyExpr: string;
  columnReordering?: boolean;
  columnResizing?: boolean;
  columnAutoWidth?: boolean;
  columnHiding?: boolean;
  columnChooserMode?: "select" | "dragAndDrop";
  columnMinWidth?: number;
  columns?: GridColumn[] | HeaderGroup[];
  levelheader?: boolean;
  rowAlternation?: boolean;
  borders?: boolean;
  columnResizingMode?: "widget" | "nextColumn";
  wordWrapEnabled?: boolean;
  focusedRowEnabled?: boolean;
  allowSearch?: boolean;
  allowFilter?: boolean;
  allowOnlyFilter?: boolean;
  allowSelect?: boolean;
  selectionMode?: "single" | "multiple";
  showToolbar?: boolean;
  grouping?: boolean;
  groupingAutoExpand?: boolean;
  groupExpandMode?: string;
  columnFixing?: boolean;
  allowExport?: boolean;
  loadPanel?: boolean;
  allowedit?: boolean;
  allowdelete?: boolean;
  allowadd?: boolean;
  editMode?: "batch" | "cell" | "row" | "form" | "popup";
  gridWidth?: string;
  showtitle?: boolean;
  popupwidth?: number;
  popupheigth?: number;
  scrollMode?: "standard" | "virtual" | "infinite";
  edittitle?: string;
  newDataDefault?: () => any;
  onRowUpdating?: (e: any) => any;
  onRowRemoving?: (e: any) => any;
  onRowInserting?: (e: any) => any;
  onRowPrepared?: (e: any) => any;
  onContentReady?: (e: any) => any;
  onSaved?: (e: any) => any;
  onRowClick?: (e: any) => any;
  onRowDblClick?: (e: any) => any;
  onCellPrepared?: (e: any) => any;
  onSelectionChanged?: (e: any) => any;
  onEditingStart?: (e: any) => any;
  onEditingCanceled?: (e: any) => any;
  onInitNewRow?: (e: any) => any;
  customizeColumns?: (columns: any[]) => void;
  setOpenCreateModal?: (open: boolean) => void;
  summary?: SummaryConfig;
  width?: string;
  height?: number;
  stateStoreName?: string;
  excelFileName?: string;
  showDefColButton?: boolean;
  showAllColButton?: boolean;
  showChooseColButton?: boolean;
  showExportButton?: boolean;
  disabled?: boolean;
  gridButtons?: GridButtonsConfig;
  gridHyperlinks?: GridHyperlinkConfig[];
  masterDetail?: GridColumn[];
  className?: string;
};

export const DataGrid: React.FC<DataGridProps> = ({
  datatable,
  keyExpr,
  columnReordering = true,
  columnResizing = true,
  columnAutoWidth = false,
  columnHiding = false,
  columnChooserMode = "select",
  columnMinWidth = 20,
  columns = [],
  levelheader = false,
  rowAlternation = true,
  borders = true,
  columnResizingMode = "widget",
  wordWrapEnabled = false,
  focusedRowEnabled = false,
  allowSearch = true,
  allowFilter = true,
  allowOnlyFilter = false,
  allowSelect = false,
  selectionMode = "multiple",
  showToolbar = true,
  grouping = true,
  groupingAutoExpand = true,
  groupExpandMode,
  columnFixing = true,
  allowExport = true,
  loadPanel = true,
  allowedit = false,
  allowdelete = false,
  allowadd = false,
  editMode = "batch",
  gridWidth = "auto",
  showtitle = false,
  popupwidth = 700,
  popupheigth = 525,
  scrollMode = "infinite",
  edittitle,
  // newDataDefault = () => ({}),
  onRowUpdating = () => ({}),
  onRowRemoving = () => ({}),
  onRowInserting = () => ({}),
  onRowPrepared = () => ({}),
  onContentReady = () => ({}),
  onSaved = () => ({}),
  onRowClick = () => ({}),
  onRowDblClick = () => ({}),
  onCellPrepared = () => ({}),
  onSelectionChanged = () => ({}),
  onEditingStart = () => ({}),
  // onEditingCanceled = () => ({}),
  onInitNewRow = () => ({}),
  setOpenCreateModal = () => ({}),
  customizeColumns,

  summary,
  width = "100%",
  height = 700,
  stateStoreName,
  excelFileName = `export-${new Date().toISOString().substring(0, 10)}`,
  showDefColButton = false,
  showAllColButton = true,
  showChooseColButton = true,
  showExportButton = true,
  disabled = false,
  gridButtons,
  gridHyperlinks,
  masterDetail,
  className,
}) => {
  const dataGridRef = useRef<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasPhotoFile, setHasPhotoFile] = useState(false);
  const isMacOS =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  // Default formats and alignments
  const defaultFormat = { datetime: "MM/dd/yyyy HH:mm" };
  const defaultAlignment = { datetime: "center", date: "center" };
  const sdisplayFormat = "{0}";
  const svalueFormat = "###,##0";
  const sdefaultType = "sum";

  // Check if data has photo files
  useEffect(() => {
    if (Array.isArray(datatable)) {
      setHasPhotoFile(datatable.some((item) => item.photofile));
    }
  }, [datatable]);

  // Check for dark mode
  useEffect(() => {
    // You can implement your dark mode detection logic here
    // For example, checking a CSS variable or using a theme context
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  // Grid instance methods
  const expandAll = useCallback(() => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.expandAll(0);
    }
  }, []);

  const collapseAll = useCallback(() => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.collapseAll();
    }
  }, []);

  const showAllColumns = useCallback(() => {
    if (dataGridRef.current) {
      const instance = dataGridRef.current.instance;
      const cols = instance.option("columns");

      instance.beginUpdate();
      for (let i = 0; i < cols.length; i++) {
        if (
          cols[i] &&
          (cols[i].visible === false || cols[i].visible === undefined) &&
          cols[i].showInColumnChooser !== false
        ) {
          instance.columnOption(i, { visible: true });
        }
      }
      instance.endUpdate();

      // You can implement a notification system here
      console.log("All columns were loaded");
    }
  }, []);

  const defaultViewColumns = useCallback(() => {
    if (dataGridRef.current) {
      const instance = dataGridRef.current.instance;
      const cols = instance.option("columns");

      instance.beginUpdate();
      for (let i = 0; i < cols.length; i++) {
        if (cols[i] && cols[i].visible === false) {
          instance.columnOption(i, { visible: false });
        } else if (cols[i].visible === undefined) {
          instance.columnOption(i, { visible: true });
        }
      }
      instance.endUpdate();

      // You can implement a notification system here
      console.log("Default columns were loaded");
    }
  }, []);

  // Export functions
  const exportToCSV = useCallback(
    (e: any) => {
      console.log("Exporting to CSV...");
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      exportDataGrid({
        component: e.component,
        worksheet: worksheet,
      }).then(() => {
        workbook.csv.writeBuffer().then((buffer) => {
          const name = `${excelFileName}.csv`;
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            name
          );
        });
      });
    },
    [excelFileName]
  );

  // Excel cell customization
  const customizeExcelCell = useCallback(
    (e: any) => {
      if (e && e.value && e.gridCell && e.gridCell.column) {
        let found = false;

        // Column specific customization
        if (Array.isArray(columns) && !levelheader) {
          for (let i = 0; i < columns.length && !found; i++) {
            const col = columns[i] as GridColumn;
            if (
              col.field === e.gridCell.column.dataField &&
              col.customizeExcelCell
            ) {
              found = true;
              col.customizeExcelCell(e);
            }
          }
        }

        // Handle HTML content
        if (e.gridCell.column.encodeHtml === false) {
          e.value = e.value.replace(/<br>/g, "\r\n");
          e.value = e.value.replace(/<\/tr>/g, "\r\n");
          e.value = e.value.replace(/<\/td>/g, " ");
          e.value = e.value.replace(/<(?:.|\n)*?>/gm, "");
          e.wrapTextEnabled = true;
        }
      }
    },
    [columns, levelheader]
  );

  // Toolbar customization
  const onToolbarPreparing = useCallback(
    (e: any) => {
      // Remove default buttons
      for (let i = e.toolbarOptions.items.length - 1; i >= 0; i--) {
        const item = e.toolbarOptions.items[i];
        if (
          item.name === "columnChooserButton" ||
          item.name === "exportButton"
        ) {
          e.toolbarOptions.items.splice(i, 1);
        }
      }

      // Add grouping buttons
      if (grouping) {
        e.toolbarOptions.items.unshift({
          locateInMenu: "auto",
          location: "before",
          widget: "dxButton",
          options: {
            width: 100,
            text: "Collapse All",
            onClick: collapseAll,
          },
        });

        e.toolbarOptions.items.unshift({
          locateInMenu: "auto",
          location: "before",
          widget: "dxButton",
          options: {
            width: 100,
            text: "Expand All",
            onClick: expandAll,
          },
        });
      }

      e.toolbarOptions.items = e.toolbarOptions.items.filter(
        (item: any) => item.name !== "addRowButton"
      );

      // Agregar tu botón custom
      e.toolbarOptions.items.unshift({
        location: "after",
        widget: "dxButton",
        options: {
          icon: "plus",
          text: "Create Product",
          onClick: () => setOpenCreateModal(true),
        },
      });

      // Add show all columns button
      e.toolbarOptions.items.unshift({
        locateInMenu: "auto",
        widget: "dxButton",
        location: "after",
        options: {
          text: "Show All Columns",
          visible: showAllColButton,
          onClick: showAllColumns,
        },
      });

      // Add default columns button
      e.toolbarOptions.items.unshift({
        locateInMenu: "auto",
        widget: "dxButton",
        location: "after",
        options: {
          text: "Default Columns",
          visible: showDefColButton,
          onClick: defaultViewColumns,
        },
      });

      // Add column chooser button
      e.toolbarOptions.items.unshift({
        locateInMenu: "auto",
        widget: "dxButton",
        showText: "always",
        options: {
          icon: "column-chooser",
          text: "Choose Columns",
          visible: showChooseColButton,
          onClick: () => {
            e.component.showColumnChooser();
          },
        },
        location: "after",
      });

      // Add CSV export button
      e.toolbarOptions.items.unshift({
        locateInMenu: "auto",
        widget: "dxButton",
        showText: "always",
        options: {
          icon: "file",
          text: "Export CSV",
          visible: showExportButton,
          onClick: () => exportToCSV(e),
        },
        location: "after",
      });

      // Add Excel export button
      e.toolbarOptions.items.unshift({
        locateInMenu: "auto",
        widget: "dxButton",
        showText: "always",
        options: {
          icon: "xlsxfile",
          text: "Export Excel",
          visible: showExportButton,
          onClick: () => {
            e.component.exportToExcel(false);
          },
        },
        location: "after",
      });
    },
    [
      grouping,
      expandAll,
      collapseAll,
      showAllColumns,
      defaultViewColumns,
      setOpenCreateModal,
      showAllColButton,
      showDefColButton,
      showChooseColButton,
      showExportButton,
      exportToCSV,
    ]
  );

  // Export handler
  const onExporting = useCallback(
    (e: any) => {
      if (e.format === "xlsx") {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("Main sheet");

        exportDataGrid({
          worksheet: worksheet,
          component: e.component,
          customizeCell: customizeExcelCell,
        }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `${excelFileName}.xlsx`
            );
          });
        });
      } else if (e.format === "pdf") {
        const doc = new jsPDF();

        exportDataGridToPdf({
          jsPDFDocument: doc,
          component: e.component,
        }).then(() => {
          doc.save(`${excelFileName}.pdf`);
        });
      }
    },
    [excelFileName, customizeExcelCell]
  );

  // Render columns based on configuration
  const renderColumns = () => {
    if (!columns || columns.length === 0) return null;

    if (levelheader) {
      // Render header groups
      return (columns as HeaderGroup[]).map((headerGroup) => (
        <Column
          key={headerGroup.id}
          caption={headerGroup.header}
          alignment="center"
          cssClass="header-class"
        >
          {headerGroup.columns.map((col) => renderColumn(col))}
        </Column>
      ));
    } else {
      // Render flat columns
      return (columns as GridColumn[]).map((col) => renderColumn(col));
    }
  };

  // Render a single column with all its properties
  const renderColumn = (col: GridColumn) => {
    return (
      <Column
        key={col.field}
        dataField={col.field}
        dataType={col.type}
        caption={col.caption}
        alignment={
          col.alignment ||
          (col.type &&
            defaultAlignment[col.type as keyof typeof defaultAlignment])
        }
        groupIndex={col.groupIndex}
        sortIndex={col.sortIndex}
        sortOrder={col.sortOrder || (col.sortIndex ? "asc" : undefined)}
        allowEditing={col.edit || false}
        width={col.width || "auto"}
        minWidth={columnMinWidth}
        format={
          col.format ||
          (col.type && defaultFormat[col.type as keyof typeof defaultFormat])
        }
        customizeText={col.customizeText}
        encodeHtml={col.encodeHtml}
        allowExporting={col.allowExporting}
        visible={col.visible}
        showInColumnChooser={col.showInColumnChooser}
        showWhenGrouped={!col.hideWhenGrouped}
        calculateCellValue={col.calculateCellValue}
        calculateDisplayValue={col.calculateDisplayValue}
        setCellValue={col.setCellValue}
        selectedFilterOperation={col.selectedFilterOperation}
        filterValue={col.filterValue}
        validationRules={col.validationRules}
        editorOptions={col.editorOptions}
        cssClass={col.cssClass}
        cellRender={col.cellRender}
      >
        {col.lookup && (
          <Lookup
            dataSource={col.lookup}
            displayExpr={col.display}
            valueExpr={col.value}
            allowClearing={col.allowclear}
          />
        )}
      </Column>
    );
  };

  // Render photo column if needed
  const renderPhotoColumn = () => {
    if (!hasPhotoFile) return null;

    return (
      <Column
        caption="Photo"
        width={150}
        allowSorting={false}
        dataField="photofile"
        cellRender={(data: any) => (
          <img
            src={data.value || "/placeholder.svg"}
            style={{ width: "125px", height: "125px" }}
            alt="Item"
          />
        )}
      />
    );
  };

  // Render button column if needed
  const renderButtonColumn = () => {
    if (!gridButtons) return null;

    // console.log(gridButtons);

    return (
      <Column
        width={gridButtons.width}
        allowSorting={false}
        allowEditing={false}
        dataField={gridButtons.data}
        caption=" "
        cellRender={(data: any) => (
          <div>
            {gridButtons.buttons.map((button, i) => (
              <Button
                variant={"ghost"}
                key={i}
                onClick={() => button.action(data.data)}
              >
                <PlusIcon></PlusIcon>
              </Button>
            ))}
            <span style={{ marginLeft: "0.5rem", fontSize: "0.9rem" }}>
              {data.value}
            </span>
          </div>
        )}
      />
    );
  };

  // Render hyperlink columns if needed
  const renderHyperlinkColumns = () => {
    if (!gridHyperlinks) return null;

    return gridHyperlinks.map((link) => (
      <Column
        key={link.id}
        caption={link.caption}
        width={link.width}
        allowSorting={false}
        dataField={link.data}
        cellRender={(data: any) => (
          <a href={data.value} target="_blank" rel="noopener noreferrer">
            {data.value ? "Open" : ""}
          </a>
        )}
      />
    ));
  };

  // Master detail template
  const renderMasterDetail = (data: any) => {
    if (!masterDetail || !data.data.details) return null;

    return (
      <div style={{ textAlign: "center" }}>
        <table
          className="master-detail-table"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              {masterDetail.map((col) => (
                <th
                  key={col.field}
                  className="master-detail-table"
                  style={{
                    border: "1px solid lightgray",
                    padding: "5px",
                    textAlign: (col.alignment as any) || "left",
                  }}
                >
                  {col.caption}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.data.details.map((detail: any, index: number) => (
              <tr key={detail.id || index} style={detail.rowstyle || {}}>
                {masterDetail.map((col) => (
                  <td
                    key={col.field}
                    className="master-detail-table"
                    style={{
                      border: "1px solid lightgray",
                      padding: "5px",
                      textAlign: (col.alignment as any) || "left",
                    }}
                  >
                    {detail[col.field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      className={`${className || ""} ${isDarkMode ? "dark-mode" : ""}`}
      style={{ width: gridWidth }}
    >
      <DevExtremeDataGrid
        ref={dataGridRef}
        dataSource={datatable}
        keyExpr={keyExpr}
        allowColumnReordering={columnReordering}
        allowColumnResizing={columnResizing}
        columnAutoWidth={columnAutoWidth}
        columnHidingEnabled={columnHiding}
        rowAlternationEnabled={rowAlternation}
        showBorders={borders}
        columnResizingMode={columnResizingMode}
        wordWrapEnabled={wordWrapEnabled}
        focusedRowEnabled={focusedRowEnabled}
        height={height}
        width={width}
        disabled={disabled}
        onRowUpdating={onRowUpdating}
        onRowInserting={onRowInserting}
        onRowRemoving={onRowRemoving}
        onRowPrepared={onRowPrepared}
        onContentReady={onContentReady}
        onSaved={onSaved}
        onRowClick={onRowClick}
        onRowDblClick={onRowDblClick}
        onCellPrepared={onCellPrepared}
        onSelectionChanged={onSelectionChanged}
        onEditingStart={onEditingStart}
        // onEditingCanceled={onEditingCanceled}
        onInitNewRow={onInitNewRow}
        customizeColumns={customizeColumns}
        onExporting={onExporting}
        onToolbarPreparing={onToolbarPreparing}
      >
        <FilterRow visible={allowFilter} />
        {allowOnlyFilter ? (
          <HeaderFilter visible={allowOnlyFilter} allowSearch={false} />
        ) : (
          <HeaderFilter visible={allowFilter} allowSearch={true} />
        )}
        <FilterPanel visible={allowFilter} />
        <Toolbar visible={showToolbar} />
        <SearchPanel
          visible={allowSearch}
          highlightSearchText={true}
          placeholder="Search..."
        />
        {allowSelect && (
          <Selection allowSelectAll={allowSelect} mode={selectionMode} />
        )}
        <Grouping
          contextMenuEnabled={grouping}
          allowCollapsing={true}
          autoExpandAll={groupingAutoExpand}
          expandMode={groupExpandMode}
        />
        <GroupPanel visible={grouping} />
        <LoadPanel enabled={loadPanel} />
        <Sorting mode="multiple" />
        <Scrolling
          columnRenderingMode="standard"
          mode={scrollMode}
          showScrollbar="always"
          useNative={!isMacOS}
          preloadEnabled={true}
        />
        <Export enabled={allowExport} />
        <Editing
          allowUpdating={allowedit}
          allowDeleting={allowdelete}
          allowAdding={allowadd}
          useIcons={true}
          mode={editMode}
        >
          <Popup
            showTitle={showtitle}
            width={popupwidth}
            height={popupheigth}
            title={edittitle}
          />
        </Editing>
        <ColumnFixing enabled={columnFixing} />
        <ColumnChooser
          allowSearch={true}
          enabled={columnReordering}
          mode={columnChooserMode}
          width={400}
          height={300}
        />
        {stateStoreName && (
          <StateStoring
            enabled={true}
            type="localStorage"
            storageKey={stateStoreName}
          />
        )}

        {/* Custom columns */}
        {renderPhotoColumn()}
        {renderHyperlinkColumns()}
        {renderColumns()}
        {renderButtonColumn()}

        {/* Master/Detail */}
        {masterDetail && (
          <MasterDetail enabled={true} component={renderMasterDetail} />
        )}

        {/* Summary */}
        {summary && (
          <Summary>
            {summary.summ &&
              summary.summ.map((summ) => (
                <TotalItem
                  key={summ.key}
                  column={summ.column}
                  summaryType={summ.type || sdefaultType}
                  showInColumn={summ.column}
                  displayFormat={summ.displayFormat || sdisplayFormat}
                  valueFormat={summ.valueFormat || svalueFormat}
                />
              ))}
            {summary.group &&
              summary.group.map((gr) => (
                <GroupItem
                  key={gr.key}
                  column={gr.column}
                  summaryType={gr.type || sdefaultType}
                  alignByColumn={true}
                  showInGroupFooter={false}
                  displayFormat={gr.displayFormat || sdisplayFormat}
                  valueFormat={gr.valueFormat || svalueFormat}
                />
              ))}
          </Summary>
        )}
      </DevExtremeDataGrid>
    </div>
  );
};
