const React = require('react');
const ReactDOM = require('react-dom');
const StylePropable = require('../mixins/style-propable');
const DefaultRawTheme = require('../styles/raw-themes/light-raw-theme');
const ThemeManager = require('../styles/theme-manager');

const Table = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    selectedRows: React.PropTypes.any,
    fixedFooter: React.PropTypes.bool,
    fixedHeader: React.PropTypes.bool,
    height: React.PropTypes.string,
    multiSelectable: React.PropTypes.bool,
    onCellClick: React.PropTypes.func,
    onCellHover: React.PropTypes.func,
    onCellHoverExit: React.PropTypes.func,
    onRowHover: React.PropTypes.func,
    onRowHoverExit: React.PropTypes.func,
    onRowSelection: React.PropTypes.func,
    selectable: React.PropTypes.bool,
    style: React.PropTypes.object,
    wrapperStyle: React.PropTypes.object,
    headerStyle: React.PropTypes.object,
    bodyStyle: React.PropTypes.object,
    footerStyle: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      selectedRows: [],
      fixedFooter: false,
      fixedHeader: false,
      height: 'inherit',
      multiSelectable: true,
      selectable: true,
    };
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: React.PropTypes.object,
    selectedRows: React.PropTypes.any,
  },

  getChildContext () {
    return {
      muiTheme: this.state.muiTheme,
      selectedRows: this.props.selectedRows,
    };
  },

  getInitialState () {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
      allRowsSelected: this.props.allRowsSelected,
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps (nextProps, nextContext) {
    let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
  },

  getTheme() {
    return this.state.muiTheme.table;
  },

  getStyles() {
    let styles = {
      root: {
        backgroundColor: this.getTheme().backgroundColor,
        padding: 0,
        width: '100%',
        maxWidth: '100%',
        borderCollapse: 'collapse',
        borderSpacing: 0,
        tableLayout: 'auto',
      },
      bodyTable: {
        height: (this.props.fixedHeader || this.props.fixedFooter) ? this.props.height : 'auto',
      },
      tableWrapper: {
        height: (this.props.fixedHeader || this.props.fixedFooter) ? 'auto' : this.props.height,
        overflow: 'visible',
      },
    };

    if (this.props.fixed) {
      styles.root.tableLayout = 'fixed';
    }

    return styles;
  },

  render() {
    let {
      children,
      className,
      fixedFooter,
      fixedHeader,
      style,
      wrapperStyle,
      headerStyle,
      bodyStyle,
      footerStyle,
      ...other,
    } = this.props;
    let classes = 'mui-table';
    if (className) classes += ' ' + className;
    let styles = this.getStyles();

    let tHead, tFoot, tBody;
    for (let child of children) {
      if (!React.isValidElement(child)) continue;

      let displayName = child.type.displayName;
      if (displayName === 'TableBody') {
        tBody = this._createTableBody(child);
      }
      else if (displayName === 'TableHeader') {
        tHead = this._createTableHeader(child);
      }
      else if (displayName === 'TableFooter') {
        tFoot = this._createTableFooter(child);
      }
    }

    // If we could not find a table-header and a table-body, do not attempt to display anything.
    if (!tBody && !tHead) return null;

    let mergedTableStyle = this.prepareStyles(styles.root, style);
    let headerTable, footerTable;
    let inlineHeader, inlineFooter;
    if (fixedHeader) {
      headerTable = (
        <div className="mui-header-table" style={this.prepareStyles(headerStyle)}>
          <table className={className} style={mergedTableStyle}>
            {tHead}
          </table>
        </div>
      );
    }
    else {
      inlineHeader = tHead;
    }
    if (tFoot !== undefined) {
      if (fixedFooter) {
        footerTable = (
          <div className="mui-footer-table" style={this.prepareStyles(footerStyle)}>
            <table className={className} style={mergedTableStyle}>
              {tFoot}
            </table>
          </div>
        );
      }
      else {
        inlineFooter = tFoot;
      }
    }

    return (
      <div className="mui-table-wrapper" style={this.prepareStyles(styles.tableWrapper, wrapperStyle)}>
        {headerTable}
        <div className="mui-body-table" style={this.prepareStyles(styles.bodyTable, bodyStyle)} ref="tableDiv">
          <table className={classes} style={mergedTableStyle} ref="tableBody">
            {inlineHeader}
            {inlineFooter}
            {tBody}
          </table>
        </div>
        {footerTable}
      </div>
    );
  },

  isScrollbarVisible() {
    const tableDivHeight = ReactDOM.findDOMNode(this.refs.tableDiv).clientHeight;
    const tableBodyHeight = ReactDOM.findDOMNode(this.refs.tableBody).clientHeight;

    return tableBodyHeight > tableDivHeight;
  },

  _createTableHeader(base) {
    return React.cloneElement(
      base,
      {
        enableSelectAll: base.props.enableSelectAll && this.props.selectable && this.props.multiSelectable,
        onSelectAll: this._onSelectAll,
        selectAllSelected: this.state.selectedRows === 'all',
        sort: this.props.sort,
        onSort: this._onSort,
      }
    );
  },

  _createTableBody(base) {
    return React.cloneElement(
      base,
      {
        multiSelectable: this.props.multiSelectable,
        onCellClick: this._onCellClick,
        onCellHover: this._onCellHover,
        onCellHoverExit: this._onCellHoverExit,
        onRowHover: this._onRowHover,
        onRowHoverExit: this._onRowHoverExit,
        onRowSelection: this._onRowSelection,
        selectable: this.props.selectable,
        style: this.mergeAndPrefix({height: this.props.height}, base.props.style),
      }
    );
  },

  _createTableFooter(base) {
    return base;
  },

  _onSort(property, order) {
    if (this.props.onSort) this.props.onSort(property, order);
  },

  _onCellClick(rowNumber, columnNumber) {
    if (this.props.onCellClick) this.props.onCellClick(rowNumber, columnNumber);
  },

  _onCellHover(rowNumber, columnNumber) {
    if (this.props.onCellHover) this.props.onCellHover(rowNumber, columnNumber);
  },

  _onCellHoverExit(rowNumber, columnNumber) {
    if (this.props.onCellHoverExit) this.props.onCellHoverExit(rowNumber, columnNumber);
  },

  _onRowHover(rowNumber) {
    if (this.props.onRowHover) this.props.onRowHover(rowNumber);
  },

  _onRowHoverExit(rowNumber) {
    if (this.props.onRowHoverExit) this.props.onRowHoverExit(rowNumber);
  },

  _onRowSelection(selectedRows, total) {
    this.setState({
      selectedRows: selectedRows.length === total ? 'all' : selectedRows
    });

    if (this.props.onRowSelection) this.props.onRowSelection(selectedRows);
  },

  _onSelectAll() {
    let selectedRows;
    if (this.state.selectedRows === 'all') {
      selectedRows = [];
    } else {
      selectedRows = 'all';
    }

    this.props.onRowSelection && this.props.onRowSelection(selectedRows);
    this.setState({ selectedRows });
  },

});

module.exports = Table;
