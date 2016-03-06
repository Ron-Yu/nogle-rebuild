const React = require('React');

const Nav = React.createClass({
  render: function() {
    return (
      <div className="form-group label-static">
        <label htmlFor="i2" className="control-label">label-static</label>
        <input type="email" className="form-control" id="i2" placeholder="placeholder attribute"/>
        <p className="help-block">This is a hint as a <code>p.help-block.hint</code></p>
      </div>
    );
  }
});

module.exports = Nav;
