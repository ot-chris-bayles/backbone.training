# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = %q{monkey-lib}
  s.version = "0.5.4"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Konstantin Haase"]
  s.date = %q{2010-09-19}
  s.description = %q{Making ruby extension frameworks pluggable.}
  s.email = %q{konstantin.mailinglists@googlemail.com}
  s.extra_rdoc_files = ["README.rdoc", "LICENSE", "lib/monkey/autoloader.rb", "lib/monkey/backend/active_support.rb", "lib/monkey/backend/backports.rb", "lib/monkey/backend/common/extract_options.rb", "lib/monkey/backend/common/parent.rb", "lib/monkey/backend/common/singleton_class.rb", "lib/monkey/backend/common/tap.rb", "lib/monkey/backend/extlib.rb", "lib/monkey/backend/facets.rb", "lib/monkey/backend.rb", "lib/monkey/engine.rb", "lib/monkey/ext/array.rb", "lib/monkey/ext/enumerable.rb", "lib/monkey/ext/file.rb", "lib/monkey/ext/module.rb", "lib/monkey/ext/object.rb", "lib/monkey/ext/pathname.rb", "lib/monkey/ext/string.rb", "lib/monkey/ext/symbol.rb", "lib/monkey/ext.rb", "lib/monkey/hash_fix.rb", "lib/monkey/matcher.rb", "lib/monkey/version.rb", "lib/monkey-lib.rb", "lib/monkey.rb"]
  s.files = ["README.rdoc", "LICENSE", "lib/monkey/autoloader.rb", "lib/monkey/backend/active_support.rb", "lib/monkey/backend/backports.rb", "lib/monkey/backend/common/extract_options.rb", "lib/monkey/backend/common/parent.rb", "lib/monkey/backend/common/singleton_class.rb", "lib/monkey/backend/common/tap.rb", "lib/monkey/backend/extlib.rb", "lib/monkey/backend/facets.rb", "lib/monkey/backend.rb", "lib/monkey/engine.rb", "lib/monkey/ext/array.rb", "lib/monkey/ext/enumerable.rb", "lib/monkey/ext/file.rb", "lib/monkey/ext/module.rb", "lib/monkey/ext/object.rb", "lib/monkey/ext/pathname.rb", "lib/monkey/ext/string.rb", "lib/monkey/ext/symbol.rb", "lib/monkey/ext.rb", "lib/monkey/hash_fix.rb", "lib/monkey/matcher.rb", "lib/monkey/version.rb", "lib/monkey-lib.rb", "lib/monkey.rb"]
  s.homepage = %q{http://github.com/rkh/monkey-lib}
  s.require_paths = ["lib"]
  s.rubygems_version = %q{1.7.2}
  s.summary = %q{Making ruby extension frameworks pluggable.}

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<backports>, [">= 0"])
    else
      s.add_dependency(%q<backports>, [">= 0"])
    end
  else
    s.add_dependency(%q<backports>, [">= 0"])
  end
end
