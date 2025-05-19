<?php

namespace App\Exports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use Carbon\Carbon;

class OrdersExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithColumnFormatting, WithEvents
{
    protected $startDate;
    protected $endDate;
    protected $totalOrders;
    protected $totalAmountSum;
    protected $totalPrintOnMaterialSum;

    public function __construct(?Carbon $startDate, ?Carbon $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->totalOrders = 0;
        $this->totalAmountSum = 0;
        $this->totalPrintOnMaterialSum = 0;
    }

    public function query()
    {
        // We no longer strictly need to eager load 'customer' if not using its details in the export
        $query = Order::with('items')->select( // Still need items for the itemsString
            'id',
            'order_number',
            'total_amount',
            'status',
            'payment_status',
            'created_at',
            'notes'
        )->latest();

        if ($this->startDate) {
            $query->where('created_at', '>=', $this->startDate);
        }
        if ($this->endDate) {
            $query->where('created_at', '<=', $this->endDate);
        }
        return $query;
    }

    public function headings(): array
    {
        return [
            'Order #',
            // 'Customer Name', // Removed
            // 'Customer Email', // Removed
            'Order Date',
            'Status',
            'Payment Status',
            'Order Items',
            'Total Amount',
            'Print on Material (15%)',
            'Order Notes',
        ];
    }

    public function map($order): array // $order is an instance of Order
    {
        $printOnMaterial = $order->total_amount * 0.15;

        $this->totalOrders++;
        $this->totalAmountSum += $order->total_amount;
        $this->totalPrintOnMaterialSum += $printOnMaterial;

        $itemsString = $order->items->map(function ($item) {
            return "{$item->quantity}x {$item->artwork_title} (Type: {$item->type}, Frame: {$item->frame}, Size: {$item->size}) @ " . number_format($item->price, 2, ',', '.') . " € each";
        })->implode("\n");

        return [
            $order->order_number,
            // Removed customer name
            // Removed customer email
            $order->created_at->format('Y-m-d H:i'),
            ucfirst($order->status),
            ucfirst($order->payment_status),
            $itemsString,
            (float) $order->total_amount,
            (float) $printOnMaterial,
            $order->notes,
        ];
    }

    public function columnFormats(): array
    {
        $explicitEuroFormatCommaDecimal = '€#.##0,00';
        return [
            // Columns shift left after removing two columns
            // Old H (Total Amount) is now F
            // Old I (Print on Material) is now G
            'F' => $explicitEuroFormatCommaDecimal, // Total Amount
            'G' => $explicitEuroFormatCommaDecimal, // Print on Material
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Header row now goes up to H (Order # to Order Notes)
        $sheet->getStyle('A1:H1')->getFont()->setBold(true)->setSize(12);
        // Order Items column is now E
        $sheet->getStyle('E')->getAlignment()->setWrapText(true);
        return [];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastDataRow = $this->totalOrders + 1;
                $footerRow = $lastDataRow + 2;
                $explicitEuroFormatCommaDecimal = '€#.##0,00';

                $sheet->setCellValue("A{$footerRow}", 'Totals:');
                $sheet->setCellValue("B{$footerRow}", $this->totalOrders . ' Orders');
                // Columns for sums shift left
                // Old G (Total Amount Sum) is now F
                // Old H (Total Print Sum) is now G
                $sheet->setCellValue("F{$footerRow}", $this->totalAmountSum);
                $sheet->setCellValue("G{$footerRow}", $this->totalPrintOnMaterialSum);

                // Adjust style range for totals row
                $sheet->getStyle("A{$footerRow}:G{$footerRow}")->applyFromArray(['font' => ['bold' => true, 'size' => 11]]);

                $sheet->getStyle("F{$footerRow}")->getNumberFormat()->setFormatCode($explicitEuroFormatCommaDecimal);
                $sheet->getStyle("G{$footerRow}")->getNumberFormat()->setFormatCode($explicitEuroFormatCommaDecimal);
            },
        ];
    }
}
