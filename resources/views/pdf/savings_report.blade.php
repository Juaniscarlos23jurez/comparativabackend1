<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Prescription Savings Plan Report</title>
    <style>
        @page {
            margin: 40px 30px;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 13px;
            color: #1a1c2e;
            line-height: 1.5;
            background-color: #fcfbfa;
            margin: 0;
            padding: 0;
        }
        .header {
            border-bottom: 2px solid #3a6fa8;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .logo {
            font-size: 26px;
            font-weight: bold;
            color: #3a6fa8;
            letter-spacing: 0.5px;
        }
        .subtitle {
            font-size: 11px;
            color: #6a6c7d;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 3px;
        }
        .title {
            font-size: 19px;
            font-weight: bold;
            margin-top: 0;
            margin-bottom: 8px;
            color: #1a1c2e;
        }
        .desc {
            color: #555566;
            font-size: 12px;
            margin-bottom: 25px;
            line-height: 1.6;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #3a6fa8;
            text-transform: uppercase;
            border-bottom: 1px solid #e5e3dd;
            padding-bottom: 6px;
            margin-top: 25px;
            margin-bottom: 12px;
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .summary-table td {
            width: 33.33%;
            padding: 12px;
            border: 1px solid #e5e3dd;
            background-color: #f7f5ef;
            text-align: center;
            border-radius: 6px;
        }
        .metric-title {
            font-size: 10px;
            font-weight: bold;
            color: #6a6c7d;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .metric-val {
            font-size: 18px;
            font-weight: bold;
        }
        .metric-val.green {
            color: #2e7d52;
        }
        .metric-val.blue {
            color: #3a6fa8;
        }
        
        .option-box {
            border: 1px solid #e5e3dd;
            border-radius: 8px;
            padding: 15px;
            background-color: #ffffff;
            margin-bottom: 20px;
        }
        .option-header {
            font-size: 13px;
            font-weight: bold;
            color: #1a1c2e;
            border-bottom: 1px solid #f0eee8;
            padding-bottom: 8px;
            margin-bottom: 10px;
        }
        .option-tag {
            float: right;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .tag-blue { background-color: #e3f2fd; color: #0d47a1; }
        .tag-green { background-color: #e8f5e9; color: #1b5e20; }
        .tag-orange { background-color: #fff3e0; color: #e65100; }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }
        .table th {
            text-align: left;
            padding: 6px 10px;
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
            color: #6a6c7d;
            border-bottom: 1px solid #cbd5e0;
        }
        .table td {
            padding: 8px 10px;
            border-bottom: 1px solid #f0eee8;
            font-size: 11px;
        }
        .text-right {
            text-align: right;
        }
        .card-container {
            border: 2px dashed #3a6fa8;
            border-radius: 8px;
            padding: 15px;
            background-color: #f7f5ef;
            margin-top: 30px;
            page-break-inside: avoid;
        }
        .card-title {
            font-weight: bold;
            color: #3a6fa8;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        .card-info {
            font-family: monospace;
            font-size: 11px;
            color: #1a1c2e;
        }
        .footer {
            margin-top: 40px;
            font-size: 9px;
            color: #8a8c9d;
            text-align: center;
            border-top: 1px solid #e5e3dd;
            padding-top: 15px;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
    </style>
</head>
<body>

    <div class="header">
        <table style="width: 100%;">
            <tr>
                <td>
                    <div class="logo">MEDSAVER</div>
                    <div class="subtitle">Multi-Drug Savings & Logistics Optimizer</div>
                </td>
                <td class="text-right" style="font-size: 11px; color: #6a6c7d; vertical-align: bottom;">
                    Date Generated: {{ date('F d, Y') }}<br>
                    Prepared for: {{ $user->email ?? 'Guest Patient' }}
                </td>
            </tr>
        </table>
    </div>

    <div class="title">My Optimized Prescription Plan</div>
    <div class="desc">
        This report analyzes your prescription bundle across multiple pharmacies to find the perfect balance between savings and travel convenience. Below are the optimized scenarios computed for your local area.
    </div>

    <div class="section-title">Scenario Comparison Summary</div>
    <table class="summary-table">
        <tr>
            <td>
                <div class="metric-title">1. Conveniencia (1 Parada)</div>
                <div class="metric-val blue">${{ number_format($options['conveniencia']['total'], 2) }}/mo</div>
                <div style="font-size: 10px; color: #6a6c7d; margin-top: 3px;">At: {{ $options['conveniencia']['brand'] }}</div>
            </td>
            <td>
                <div class="metric-title">2. Ahorro Máximo (Max 2 Paradas)</div>
                <div class="metric-val green">${{ number_format($options['split']['total'], 2) }}/mo</div>
                <div style="font-size: 10px; color: #6a6c7d; margin-top: 3px;">At: {{ $options['split']['brandA'] }} & {{ $options['split']['brandB'] }}</div>
            </td>
            <td>
                <div class="metric-title">3. Ahorro Extremo (Multi-Parada)</div>
                <div class="metric-val" style="color: #e65100;">${{ number_format($options['individual']['total'], 2) }}/mo</div>
                <div style="font-size: 10px; color: #6a6c7d; margin-top: 3px;">At: Cheapest Individual Store</div>
            </td>
        </tr>
    </table>

    <div class="section-title">Optimized Scenario Details</div>

    <!-- Scenario 1 -->
    <div class="option-box">
        <div class="option-header clearfix">
            <span class="option-tag tag-blue">1 Stop Option</span>
            <strong>Scenario A: Convenient Single Stop ({{ $options['conveniencia']['brand'] }})</strong>
        </div>
        <div style="font-size: 11px; color: #6a6c7d; margin-bottom: 10px;">
            Buy all your medications at one pharmacy chain to minimize driving and prescription pickups.
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>Medication Name</th>
                    <th>Pharmacy Name</th>
                    <th class="text-right">Coupon Cost</th>
                </tr>
            </thead>
            <tbody>
                @foreach($options['conveniencia']['items'] as $item)
                    <tr>
                        <td style="font-weight: bold;">{{ $item['medication'] }}</td>
                        <td>{{ $item['pharmacy'] }}</td>
                        <td class="text-right">${{ number_format($item['price'], 2) }}</td>
                    </tr>
                @endforeach
                <tr style="background-color: #fbfbfa; font-weight: bold;">
                    <td colspan="2" style="border-top: 1px solid #cbd5e0;">TOTAL MONTHLY COST</td>
                    <td class="text-right" style="border-top: 1px solid #cbd5e0; color: #3a6fa8;">${{ number_format($options['conveniencia']['total'], 2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Scenario 2 -->
    <div class="option-box">
        <div class="option-header clearfix">
            <span class="option-tag tag-green">2 Stops Option</span>
            <strong>Scenario B: Balanced Split ({{ $options['split']['brandA'] }} & {{ $options['split']['brandB'] }})</strong>
        </div>
        <div style="font-size: 11px; color: #6a6c7d; margin-bottom: 10px;">
            Minimize costs by splitting your list between at most two pharmacy locations.
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>Medication Name</th>
                    <th>Optimal Pharmacy</th>
                    <th class="text-right">Coupon Cost</th>
                </tr>
            </thead>
            <tbody>
                @foreach($options['split']['items'] as $item)
                    <tr>
                        <td style="font-weight: bold;">{{ $item['medication'] }}</td>
                        <td>{{ $item['pharmacy'] }} ({{ $item['brand'] }})</td>
                        <td class="text-right">${{ number_format($item['price'], 2) }}</td>
                    </tr>
                @endforeach
                <tr style="background-color: #fbfbfa; font-weight: bold;">
                    <td colspan="2" style="border-top: 1px solid #cbd5e0;">TOTAL MONTHLY COST</td>
                    <td class="text-right" style="border-top: 1px solid #cbd5e0; color: #2e7d52;">${{ number_format($options['split']['total'], 2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Scenario 3 -->
    <div class="option-box" style="page-break-inside: avoid;">
        <div class="option-header clearfix">
            <span class="option-tag tag-orange">Unrestricted</span>
            <strong>Scenario C: Absolute Cheapest Price (No Location Limits)</strong>
        </div>
        <div style="font-size: 11px; color: #6a6c7d; margin-bottom: 10px;">
            Get the absolute lowest price for every single drug, regardless of how many locations you visit.
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>Medication Name</th>
                    <th>Cheapest Pharmacy</th>
                    <th class="text-right">Coupon Cost</th>
                </tr>
            </thead>
            <tbody>
                @foreach($options['individual']['items'] as $item)
                    <tr>
                        <td style="font-weight: bold;">{{ $item['medication'] }}</td>
                        <td>{{ $item['pharmacy'] }}</td>
                        <td class="text-right">${{ number_format($item['price'], 2) }}</td>
                    </tr>
                @endforeach
                <tr style="background-color: #fbfbfa; font-weight: bold;">
                    <td colspan="2" style="border-top: 1px solid #cbd5e0;">TOTAL MONTHLY COST</td>
                    <td class="text-right" style="border-top: 1px solid #cbd5e0; color: #e65100;">${{ number_format($options['individual']['total'], 2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Discount Coupon Credentials -->
    <div class="card-container">
        <div class="card-title">NeedyMeds Prescription Discount Coupon Credentials</div>
        <table style="width: 100%;">
            <tr>
                <td style="width: 65%;">
                    <div class="card-info">
                        <strong>BIN:</strong> 019520 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>PCN:</strong> NMeds<br>
                        <strong>GRP:</strong> DRUGCARD &nbsp;&nbsp; <strong>ID:</strong> NMNA733663784223
                    </div>
                    <p style="font-size: 9px; color: #6a6c7d; margin-top: 8px; line-height: 1.3;">
                        <strong>Pharmacist Instructions:</strong> Please process this coupon to receive the negotiated discount prices listed in this plan. This is a pre-negotiated program and is not health insurance.
                    </p>
                </td>
                <td style="width: 35%; vertical-align: middle; text-align: right;">
                    <div style="font-size: 14px; font-weight: bold; color: #2e7d52;">SAVE UP TO 80%</div>
                    <div style="font-size: 9px; color: #6a6c7d;">Accepted at 65,000+ Stores</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="footer">
        * Confidential Document generated by MedSaver. This report is for information purposes. Copays and pharmacy prices may vary based on location and insurance policies.
    </div>

</body>
</html>
