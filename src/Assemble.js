import jquery from "jquery"

class Assemble {
  constructor(url) {
    this.url = url
    this.watches = {}
    this.active = true
  }

  run(system) {
    return (template, ...expressions) => new Promise(resolve => {
      const code = template.reduce((accumulator, part, i) => {
        return accumulator + expressions[i - 1] + part
      })

      jquery.ajax({
        url: "/evaluate",
        type: "POST",
        data: { system, code },
        success: resolve,
        error: resolve,
      })
    }).then((result) => {
      let watches = this.watches[system]
      if(this.active && watches !== undefined) {
        watches.forEach((watch) => {
          watch()
        })
      }

      return result;
    })
  }

  watch(system) {
    if(this.watches[system] === undefined) {
      this.watches[system] = []
    }

    let templating = (template, ...expressions) => {
      const code = template.reduce((accumulator, part, i) => {
        return accumulator + expressions[i - 1] + part
      })

      return (callback) => {
        let watch = () =>
          jquery.ajax({
            url: "/evaluate",
            type: "POST",
            data: { system, code },
            success: (result) => { if(this.active) { callback(result) } },
            error: (result) => { if(this.active) { callback(result) } },
          })

        this.watches[system].push(watch)
        watch()
      }
    }

    return templating
  }

  destruct() {
    this.watches = {}
    this.active = false
  }
}

export default Assemble
