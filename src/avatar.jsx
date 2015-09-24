let React = require('react/addons');
let StylePropable = require('./mixins/style-propable');
let Colors = require('./styles/colors');
let Tooltip = require('./tooltip');

let Avatar = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    backgroundColor: React.PropTypes.string,
    color: React.PropTypes.string,
    icon: React.PropTypes.element,
    size: React.PropTypes.number,
    src: React.PropTypes.string,
    style: React.PropTypes.object,
    tooltip: React.PropTypes.string,
    tooltipStyle: React.PropTypes.object,
    onHover: React.PropTypes.func,
    onHoverExit: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      backgroundColor: Colors.grey400,
      color: Colors.white,
      size: 40,
    };
  },

  getInitialState() {
    return {
      hovered: false,
    };
  },

  render() {
    let {
      backgroundColor,
      color,
      icon,
      size,
      src,
      style,
      tooltip,
      tooltipStyle,
      ...other,
    } = this.props;

    let styles = {
      root: {
        height: size,
        width: size,
        userSelect: 'none',
        borderRadius: '50%',
        display: 'inline-block',
      },
      tooltip: {
        boxSizing: 'border-box',
        marginTop: '-10px',
        top: 'auto',
      },
    };

    let handlers = {
      onMouseEnter: this._onMouseEnter,
      onMouseLeave: this._onMouseLeave,
    };

    if (this.props.tooltip !== undefined) {
      tooltip = (
        <Tooltip
          label={this.props.tooltip}
          show={this.state.hovered}
          style={this.mergeAndPrefix(styles.tooltip, tooltipStyle)} />
      );
    }

    if (src) {
      const borderColor = this.context.muiTheme.component.avatar.borderColor;

      if(borderColor) {
        styles.root = this.mergeStyles(styles.root, {
          height: size - 2,
          width: size - 2,
          border: 'solid 1px ' + borderColor,
        });
      }

      return <img {...other} src={src} style={this.mergeAndPrefix(styles.root, style)} />;
    } else {
      styles.root = this.mergeStyles(styles.root, {
        backgroundColor: backgroundColor,
        textAlign: 'center',
        lineHeight: size + 'px',
        fontSize: size / 2 + 4,
        color: color,
      });

      const styleIcon = {
        margin: 8,
      };

      const iconElement = icon ? React.cloneElement(icon, {
        color: color,
        style: this.mergeStyles(styleIcon, icon.props.style),
      }) : null;

      return <div {...handlers} {...other} style={this.mergeAndPrefix(styles.root, style)}>
        {iconElement}
        { tooltip }
        {this.props.children}
      </div>;
    }
  },

  _onMouseEnter(e) {
    if (this.props.tooltip !== undefined) {
      this.setState({hovered: true});
    }
  },

  _onMouseLeave(e) {
    if (this.props.tooltip !== undefined) {
      this.setState({hovered: false});
    }
  },
});

module.exports = Avatar;
