jasmine.getFixtures().fixturesPath = '/views/';

jasmine.Fixtures.prototype.loadTemplate_ = function(name) {
  var fixtureData = readFixtures(name + ".erb");
  f = fixtureData.replace(/<%= image\[:(.*)\] %>/g, "\$\{$1\}");
  console.log(f);
  setFixtures("<script id='" + name + "' type='text/x-jquery-tmpl'>" + f + "</script>");
};

function loadTemplate(name) {
  jasmine.getFixtures().loadTemplate_(name);
}
