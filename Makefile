.DEFAULT_GOAL := help
.PHONY: help build

# Build variables for JS artefacts
jssrcfiles := $(wildcard src/js/*.js)
jssrcbasenames := $(notdir $(basename $(jssrcfiles)))
jsbrowserified := $(foreach f,$(jssrcbasenames),build/js/$(f).js)

# JavaScript
build/js/%.js: src/js/%.js
	@mkdir -p $(dir $@)
	./node_modules/.bin/browserify $< -o $@

# Build variables for JS artefacts
htmlsrcfiles := $(wildcard src/*.html)
htmlsrcbasenames := $(notdir $(basename $(htmlsrcfiles)))
htmlbuildfiles := $(foreach f,$(htmlsrcbasenames),build/$(f).html)

# HTML

build/%.html: src/%.html
	@mkdir -p $(dir $@)
	cp $< $@

# MAIN

build: $(htmlbuildfiles) $(jsbrowserified) ## Build for production environment

debug: ## Print variables
	@echo "jssrcfiles=$(jssrcfiles)"
	@echo "jssrcbasenames=$(jssrcbasenames)"
	@echo "jsbrowserified=$(jsbrowserified)"
	@echo "htmlsrcfiles=$(htmlsrcfiles)"
	@echo "htmlsrcbasenames=$(htmlsrcbasenames)"
	@echo "htmlbuildfiles=$(htmlbuildfiles)"

help: ## (default), display the list of make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
