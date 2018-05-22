import jquery from "jquery"

// A function to help evaluate arbitrary code on the server.
// Unbelievably insecure.
function server(code) {
  return new Promise(resolve =>
    jquery.ajax({
      url: "/evaluate",
      type: "POST",
      data: { code },
      success: resolve,
      error: resolve,
    })
  )
}

export default server
