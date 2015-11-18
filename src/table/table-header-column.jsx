const React = require('react');
const StylePropable = require('../mixins/style-propable');
const Tooltip = require('../tooltip');
const FontIcon = require('../font-icon');
const Colors = require('../styles/colors');
const DefaultRawTheme = require('../styles/raw-themes/light-raw-theme');
const ThemeManager = require('../styles/theme-manager');

const TableHeaderColumn = React.createClass({

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

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext () {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  getDefaultProps() {
    return {
      sortOrder: 'asc',
    };
  },

  getInitialState () {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
      hovered: false,
    };
  },

  getInitialState () {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
      hovered: false,
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps (nextProps, nextContext) {
    let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
  },

  getTheme() {
    return this.state.muiTheme.tableHeaderColumn;
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
          style={this.mergeStyles(styles.tooltip, tooltipStyle)} />
      );
    }

    if (sort) {
      styles.root.cursor = 'pointer';

      if(sorting.property === sort) {
        styles.root.color = Colors.black;

        sortIcon = (
          <FontIcon style={{verticalAlign: 'middle'}} className="material-icons" color={styles.root.color}>{sorting.order == 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'}</FontIcon>
        )
      }
    }

    return (
      <th
        key={this.props.key}
        className={classes}
        style={this.prepareStyles(styles.root, style)}
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
