const React = require('react');
const StylePropable = require('../mixins/style-propable');
const ThemeManager = require('../styles/theme-manager');
const DefaultRawTheme = require('../styles/raw-themes/light-raw-theme');


const CardActions = React.createClass({
  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
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

  getInitialState() {
    return { 
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps (nextProps, nextContext) {
    let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
  },

  getStyles() {
    return {
      root: {
        padding: 8,
        position: 'relative',
      },
    };
  },

  propTypes: {
    expandable: React.PropTypes.bool,
    actAsExpander: React.PropTypes.bool,
    showExpandableButton: React.PropTypes.bool,
    style: React.PropTypes.object,
  },

  render() {
    let styles = this.getStyles();

    let children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        style: {marginRight: 8},
      });
    });

    return (
      <div {...this.props} style={this.prepareStyles(styles.root, this.props.style)}>
        {children}
      </div>
    );
  },
});

module.exports = CardActions;
