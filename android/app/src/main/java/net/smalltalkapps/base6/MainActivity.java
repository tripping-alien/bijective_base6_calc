package net.smalltalkapps.base6;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.LinearLayout;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    public static final String TARGET_URL = "https://tripping-alien.github.io/bijective_base6_calc/";
    public static final String HOST_DOMAIN = "tripping-alien.github.io";

    private WebView mWebView;
    private ProgressBar mProgressBar;
    private LinearLayout mOfflineLayout;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        new RateHelper(this).notifyAppLaunch();
        setContentView(R.layout.activity_main);

        mWebView = findViewById(R.id.webview);
        mProgressBar = findViewById(R.id.progressBar);
        mOfflineLayout = findViewById(R.id.offlineLayout);
        Button retryButton = findViewById(R.id.retryButton);

        // Retry Button
        retryButton.setOnClickListener(v -> {
            if (isNetworkAvailable()) {
                mOfflineLayout.setVisibility(View.GONE);
                mWebView.setVisibility(View.VISIBLE);
                mWebView.loadUrl(TARGET_URL);
            }
        });

        // Setup WebSettings
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        // Prevent pull-to-refresh & overscroll bounce completely
        mWebView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        mWebView.setVerticalScrollBarEnabled(true);

        // WebChromeClient for Progress
        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    mProgressBar.setVisibility(View.VISIBLE);
                    mProgressBar.setProgress(newProgress);
                } else {
                    mProgressBar.setVisibility(View.GONE);
                }
            }
        });

        // WebViewClient
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme();
                String host = uri.getHost();
                if ("https".equalsIgnoreCase(scheme) && HOST_DOMAIN.equalsIgnoreCase(host)) {
                    return false; // Stay in WebView
                }
                // Open safe external links (https, http, mailto, tel) in default browser
                if ("https".equalsIgnoreCase(scheme) || "http".equalsIgnoreCase(scheme)
                        || "mailto".equalsIgnoreCase(scheme) || "tel".equalsIgnoreCase(scheme)) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                        startActivity(intent);
                    } catch (Exception ignored) {}
                }
                return true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    showOfflineScreen();
                }
            }
        });

        // Modern OnBackPressed handling
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (mWebView.canGoBack()) {
                    mWebView.goBack();
                } else {
                    finish();
                }
            }
        });

        // Load initial page (supporting deep links safely within HOST_DOMAIN)
        if (isNetworkAvailable()) {
            mWebView.loadUrl(resolveDeepLinkUrl(getIntent()));
        } else {
            showOfflineScreen();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (mWebView != null && isNetworkAvailable()) {
            mWebView.loadUrl(resolveDeepLinkUrl(intent));
        }
    }

    private String resolveDeepLinkUrl(Intent intent) {
        if (intent == null || !Intent.ACTION_VIEW.equals(intent.getAction()) || intent.getData() == null) {
            return TARGET_URL;
        }
        Uri data = intent.getData();
        String scheme = data.getScheme();
        String host = data.getHost();
        if ("https".equalsIgnoreCase(scheme) && HOST_DOMAIN.equalsIgnoreCase(host)) {
            String path = data.getPath();
            if (path != null && path.startsWith("/bijective_base6_calc")) {
                return data.toString();
            }
        }
        if ("base6".equalsIgnoreCase(scheme) || ("smalltalk".equalsIgnoreCase(scheme) && "base6".equalsIgnoreCase(host))) {
            String query = data.getEncodedQuery();
            if (query != null && !query.isEmpty()) {
                return TARGET_URL + "?" + query;
            }
        }
        return TARGET_URL;
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        if (cm != null) {
            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            return activeNetwork != null && activeNetwork.isConnected();
        }
        return false;
    }

    private void showOfflineScreen() {
        mWebView.setVisibility(View.GONE);
        mOfflineLayout.setVisibility(View.VISIBLE);
    }
}
