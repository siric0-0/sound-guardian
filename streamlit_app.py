from pathlib import Path
import streamlit as st
import streamlit.components.v1 as components

# Configure Streamlit page
st.set_page_config(
    page_title="Sound Guardian",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Custom styling to make the embedded singlefile bundle look native edge-to-edge
st.markdown(
    """
    <style>
    /* Remove default Streamlit top and horizontal padding for full-bleed embedding */
    .block-container {
        padding-top: 0rem !important;
        padding-bottom: 0rem !important;
        padding-left: 0rem !important;
        padding-right: 0rem !important;
        max-width: 100% !important;
    }
    header[data-testid="stHeader"] {
        display: none;
    }
    footer {
        visibility: hidden;
    }
    iframe {
        width: 100% !important;
        border: none !important;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Locate the singlefile dist/index.html
html_path = Path(__file__).resolve().parent / "dist" / "index.html"
if not html_path.exists():
    html_path = Path("dist/index.html")

if not html_path.exists():
    st.error(
        "**`dist/index.html` not found.**\n\n"
        "Please build the frontend bundle first by running:\n"
        "```bash\n"
        "npm run build\n"
        "```"
    )
    st.stop()

# Render the self-contained singlefile app
components.html(html_path.read_text(encoding="utf-8"), height=960, scrolling=True)

