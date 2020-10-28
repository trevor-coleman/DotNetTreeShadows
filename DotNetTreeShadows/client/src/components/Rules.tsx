import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Grid, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import CenteredDiv from "./helpers/CenteredDiv";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";

pdfjs.GlobalWorkerOptions.workerSrc
    = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const Rules = () => {
  const classes = useStyles();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({numPages}: { numPages: any }) {
    setNumPages(numPages);
  }

  function nextPage() {
    if (numPages == pageNumber) return
    setPageNumber(pageNumber + 1);
    setLoading(true)
  }

  function prevPage() {
    if (numPages == pageNumber) return
    setPageNumber(pageNumber - 1);
    setLoading(true)
  }

  return (
      <Grid container direction={'column'}>
        <Grid item container xs={12} direction={"row"}>
          <Grid item xs={3} />
          <Grid item xs={1}>
            <IconButton><NavigateBeforeIcon /></IconButton>
          </Grid>
          <Grid item xs={4}>
            <CenteredDiv>Page {pageNumber} of {numPages}</CenteredDiv>
          </Grid>
          <Grid container item xs={1}>
            <IconButton onClick={nextPage}>
              <NavigateNextIcon />
            </IconButton>
          </Grid>
          <Grid item xs={3} />
        </Grid>
        <Collapse in={loading}>
          <Grid item xs={12} className={classes.progress}>
            <CenteredDiv>
              <CircularProgress />
            </CenteredDiv>
          </Grid></Collapse>
        <Grid item>
          <div>
            <Document file={process.env.PUBLIC_URL + "/rules.pdf"}
                      onLoadSuccess={onDocumentLoadSuccess}>
              <Page onRenderSuccess={() => setLoading(false)}
                    pageNumber={pageNumber} />
            </Document>

          </div>
        </Grid>

      </Grid>);
}

const useStyles = makeStyles((theme: Theme) => (
    {
      progress: {
        height: 50,
      }
    }))
