let React = require('react');
let StylePropable = require('../mixins/style-propable');
let Tooltip = require('../tooltip');
let FontIcon = require('../font-icon');
let Colors = require('../styles/colors');


let TableHeaderColumn = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    columnNumber: React.PropTypes.number,
    onClick: React.PropTypes.func,
    style: React.PropTypes.object,
    tooltip: React.PropTypes.string,
    tooltipStyle: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      sortOrder: 'asc',
    };
  },

  getInitialState() {
    return {
      hovered: false,
    };
  },

  getTheme() {
    return this.context.muiTheme.component.tableHeaderColumn;
  },

  getStyles() {
    let theme = this.getTheme();
    let styles = {
      root:  {
        fontWeight: 'normal',
        fontSize: 12,
        paddingLeft: theme.spacing,
        paddingRight: theme.spacing,
        height: theme.height,
        textAlign: 'left',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        color: this.getTheme().textColor,
        position: 'relative',
      },
      tooltip: {
        boxSizing: 'border-box',
        marginTop: theme.height / 2,
      },
    };

    if (this.props.adaptive) {
      styles.root.width = '1px';
    }

    return styles;
  },

  render() {
    let sortIcon;
    let styles = this.getStyles();
    let handlers = {
      onMouseEnter: this._onMouseEnter,
      onMouseLeave: this._onMouseLeave,
      onClick: this._onClick,
    };
    let {
      className,
      columnNumber,
      onClick,
      style,
      tooltip,
      tooltipStyle,
      sorting,
      sort,
      sortOrder,
      ...other,
    } = this.props;
    let classes = 'mui-table-header-column';
    if (className) classes += ' ' + className;

    if (this.props.tooltip !== undefined) {
      tooltip = (
        <Tooltip
          label={this.props.tooltip}
          show={this.state.hovered}
          style={this.mergeAndPrefix(styles.tooltip, tooltipStyle)} />
      );
    }

    if (sort) {
      styles.root.cursor = 'pointer';

      if(sorting.property === sort) {
        styles.root.color = Colors.black;

        sortIcon = (
          <FontIcon style={{verticalAlign: 'middle'}} className="material-icons" color={styles.root.color}>{sorting.order == 'asc' ? 'arrow_drop_down' : 'arrow_drop_up'}</FontIcon>
        )
      }
    }

    return (
      <th
        key={this.props.key}
        className={classes}
        style={this.mergeAndPrefix(styles.root, style)}
        {...handlers}
        {...other}>
        {tooltip}
        {sortIcon}
        {this.props.children}
      </th>
    );
  },

  _onMouseEnter() {
    if (this.props.tooltip !== undefined) this.setState({hovered: true});
  },

  _onMouseLeave() {
    if (this.props.tooltip !== undefined) this.setState({hovered: false});
  },

  _onClick(e) {
    let { sorting, sort, sortOrder, onSort } = this.props;

    if (sort && onSort) {
      let order;

      if (sorting.property == sort) {
        order = sorting.order == 'asc' ? 'desc' : 'asc';
      } else {
        order = sortOrder;
      };

      onSort(this.props.sort, order);
    };

    if (this.props.onClick) this.props.onClick(e, this.props.columnNumber);
  },

});

module.exports = TableHeaderColumn;
