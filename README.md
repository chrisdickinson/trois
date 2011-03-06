Trois
=====

An uploader for S3. Uses Knox, mainly, to do it's dirty deed.

Usage:

    node lib/server.js [jsonfile]

where jsonfile looks like:

    {
        "targets":{
          "<hash>":{
            "bucket":"neversawus",
            "key":"<YOUR KEY>",
            "secret":"<YOUR SECRET>"
          }
        }
    }

Once you run this server, you can embed iframes from it like so:

    <iframe src="<yourserver>/#!/<hash>/<file_input_id>/"></iframe>

When you upload a file, it'll let the parent frame know by changing its hash to
`#!/ready/<file_input_id>/<file_name>`. When you start uploading, it'll change the hash
to `#!/uploading` to let the parent know not to refresh the frame.
